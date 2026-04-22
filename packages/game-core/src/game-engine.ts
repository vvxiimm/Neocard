import {
  GameState,
  PlayerState,
  CardInstance,
  GameAction,
  GameActionType,
  MatchEvent,
  MatchEventType,
  CardDefinition,
  GamePhase,
  ActiveEffect,
  EffectType,
  CardKeyword,
  AbilityTrigger,
} from '@nexus/shared';
import { GAME_CONSTANTS, generateCardInstanceId } from '@nexus/shared';

export class GameEngine {
  private state: GameState;
  private cardDefinitions: Map<string, CardDefinition>;
  private events: MatchEvent[] = [];

  constructor(
    matchId: string,
    player1Id: string,
    player1Deck: string[],
    player2Id: string,
    player2Deck: string[],
    cardDefinitions: CardDefinition[]
  ) {
    this.cardDefinitions = new Map(cardDefinitions.map((c) => [c.id, c]));

    this.state = {
      matchId,
      currentTurn: 1,
      activePlayerId: player1Id,
      phase: GamePhase.MULLIGAN,
      players: [
        this.createPlayerState(player1Id, player1Deck),
        this.createPlayerState(player2Id, player2Deck),
      ],
    };

    this.emitEvent(MatchEventType.GAME_START, player1Id, {
      player1Id,
      player2Id,
    });
  }

  private createPlayerState(userId: string, deckCards: string[]): PlayerState {
    const shuffledDeck = this.shuffleDeck([...deckCards]);

    return {
      userId,
      nexusHp: GAME_CONSTANTS.STARTING_NEXUS_HP,
      energy: 0,
      maxEnergy: 0,
      hand: [],
      board: [],
      deck: shuffledDeck,
      graveyard: [],
      effects: [],
    };
  }

  private shuffleDeck(deck: string[]): string[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  public getState(): GameState {
    return JSON.parse(JSON.stringify(this.state));
  }

  public getEvents(): MatchEvent[] {
    return [...this.events];
  }

  public processAction(action: GameAction): {
    success: boolean;
    error?: string;
    newState: GameState;
    events: MatchEvent[];
  } {
    const eventsBefore = this.events.length;

    try {
      this.validateAction(action);

      switch (action.type) {
        case GameActionType.MULLIGAN:
          this.handleMulligan(action.playerId, action.data.cardInstanceIds);
          break;
        case GameActionType.PLAY_CARD:
          this.handlePlayCard(action.playerId, action.data);
          break;
        case GameActionType.ATTACK:
          this.handleAttack(action.playerId, action.data);
          break;
        case GameActionType.END_TURN:
          this.handleEndTurn(action.playerId);
          break;
        case GameActionType.SURRENDER:
          this.handleSurrender(action.playerId);
          break;
      }

      const newEvents = this.events.slice(eventsBefore);

      return {
        success: true,
        newState: this.getState(),
        events: newEvents,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        newState: this.getState(),
        events: [],
      };
    }
  }

  public startGame(): void {
    if (this.state.phase !== GamePhase.MULLIGAN) {
      throw new Error('Game already started');
    }

    // Draw starting hands
    for (const player of this.state.players) {
      for (let i = 0; i < GAME_CONSTANTS.STARTING_HAND_SIZE; i++) {
        this.drawCard(player);
      }
    }
  }

  public finishMulligan(playerId: string): void {
    const player = this.getPlayer(playerId);
    // Mark mulligan as done (in real impl, track this)

    // Check if both players finished mulligan
    const allFinished = true; // Simplified
    if (allFinished) {
      this.state.phase = GamePhase.DRAW;
      this.startTurn();
    }
  }

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  private handleMulligan(playerId: string, cardInstanceIds: string[]): void {
    const player = this.getPlayer(playerId);

    if (this.state.phase !== GamePhase.MULLIGAN) {
      throw new Error('Mulligan phase is over');
    }

    // Remove selected cards from hand and put back in deck
    const cardsToMulligan = player.hand.filter((c) =>
      cardInstanceIds.includes(c.instanceId)
    );

    for (const card of cardsToMulligan) {
      const index = player.hand.indexOf(card);
      player.hand.splice(index, 1);
      player.deck.push(card.cardDefinitionId);
    }

    // Shuffle deck
    player.deck = this.shuffleDeck(player.deck);

    // Draw new cards
    for (let i = 0; i < cardsToMulligan.length; i++) {
      this.drawCard(player);
    }

    this.emitEvent(MatchEventType.CARD_DRAWN, playerId, {
      count: cardsToMulligan.length,
    });
  }

  private handlePlayCard(
    playerId: string,
    data: { cardInstanceId: string; targetId?: string; position?: number }
  ): void {
    const player = this.getPlayer(playerId);

    if (this.state.activePlayerId !== playerId) {
      throw new Error('Not your turn');
    }

    if (this.state.phase !== GamePhase.MAIN) {
      throw new Error('Cannot play cards in this phase');
    }

    const cardInstance = player.hand.find((c) => c.instanceId === data.cardInstanceId);
    if (!cardInstance) {
      throw new Error('Card not in hand');
    }

    const cardDef = this.cardDefinitions.get(cardInstance.cardDefinitionId);
    if (!cardDef) {
      throw new Error('Card definition not found');
    }

    if (player.energy < cardDef.cost) {
      throw new Error('Insufficient energy');
    }

    // Pay energy cost
    player.energy -= cardDef.cost;

    // Remove from hand
    const handIndex = player.hand.indexOf(cardInstance);
    player.hand.splice(handIndex, 1);

    // Play card based on type
    if (cardDef.type === 'UNIT') {
      if (player.board.length >= GAME_CONSTANTS.MAX_BOARD_SIZE) {
        throw new Error('Board is full');
      }
      player.board.push(cardInstance);
      cardInstance.canAttack = cardInstance.keywords.includes(CardKeyword.RUSH);
    } else if (cardDef.type === 'SPELL') {
      // Execute spell effect
      this.executeCardAbilities(cardInstance, player, AbilityTrigger.ON_PLAY);
      // Spell goes to graveyard
      player.graveyard.push(cardInstance.cardDefinitionId);
    }

    this.emitEvent(MatchEventType.CARD_PLAYED, playerId, {
      cardInstanceId: cardInstance.instanceId,
      cardDefinitionId: cardInstance.cardDefinitionId,
    });

    // Trigger ON_PLAY abilities
    this.executeCardAbilities(cardInstance, player, AbilityTrigger.ON_PLAY);
  }

  private handleAttack(
    playerId: string,
    data: { attackerId: string; targetId: string }
  ): void {
    const player = this.getPlayer(playerId);
    const opponent = this.getOpponent(playerId);

    if (this.state.activePlayerId !== playerId) {
      throw new Error('Not your turn');
    }

    if (this.state.phase !== GamePhase.MAIN) {
      throw new Error('Cannot attack in this phase');
    }

    const attacker = player.board.find((c) => c.instanceId === data.attackerId);
    if (!attacker) {
      throw new Error('Attacker not found on board');
    }

    if (!attacker.canAttack) {
      throw new Error('Unit cannot attack this turn');
    }

    if (attacker.attacksThisTurn >= 1 && !attacker.keywords.includes(CardKeyword.FRENZY)) {
      throw new Error('Unit already attacked');
    }

    // Check if target is nexus or unit
    if (data.targetId === 'nexus') {
      // Check for guard units
      const hasGuard = opponent.board.some((u) => u.keywords.includes(CardKeyword.GUARD));
      if (hasGuard) {
        throw new Error('Must attack guard units first');
      }

      // Attack nexus
      const damage = attacker.attack;
      opponent.nexusHp -= damage;

      this.emitEvent(MatchEventType.DAMAGE_DEALT, playerId, {
        attackerId: attacker.instanceId,
        targetId: 'nexus',
        damage,
      });

      // Check for lifesteal
      if (attacker.keywords.includes(CardKeyword.LIFESTEAL)) {
        player.nexusHp += damage;
      }
    } else {
      // Attack unit
      const target = opponent.board.find((c) => c.instanceId === data.targetId);
      if (!target) {
        throw new Error('Target not found');
      }

      // Deal damage
      const attackerDamage = attacker.attack;
      const targetDamage = target.attack;

      target.currentHp -= attackerDamage;
      attacker.currentHp -= targetDamage;

      this.emitEvent(MatchEventType.UNIT_ATTACK, playerId, {
        attackerId: attacker.instanceId,
        targetId: target.instanceId,
        attackerDamage,
        targetDamage,
      });

      // Check for deaths
      if (target.currentHp <= 0) {
        this.destroyUnit(opponent, target);
      }
      if (attacker.currentHp <= 0) {
        this.destroyUnit(player, attacker);
      }
    }

    attacker.attacksThisTurn++;
    attacker.canAttack = attacker.keywords.includes(CardKeyword.FRENZY);

    // Check win condition
    this.checkWinCondition();
  }

  private handleEndTurn(playerId: string): void {
    if (this.state.activePlayerId !== playerId) {
      throw new Error('Not your turn');
    }

    this.emitEvent(MatchEventType.TURN_END, playerId, {
      turn: this.state.currentTurn,
    });

    // Switch active player
    const currentIndex = this.state.players.findIndex((p) => p.userId === playerId);
    const nextIndex = (currentIndex + 1) % this.state.players.length;
    this.state.activePlayerId = this.state.players[nextIndex].userId;

    // Increment turn if back to first player
    if (nextIndex === 0) {
      this.state.currentTurn++;
    }

    this.startTurn();
  }

  private handleSurrender(playerId: string): void {
    const opponent = this.getOpponent(playerId);
    this.emitEvent(MatchEventType.GAME_END, playerId, {
      winnerId: opponent.userId,
      reason: 'surrender',
    });
  }

  // ============================================================================
  // GAME FLOW
  // ============================================================================

  private startTurn(): void {
    const player = this.getPlayer(this.state.activePlayerId);

    this.state.phase = GamePhase.DRAW;

    // Draw card
    this.drawCard(player);

    // Gain energy
    if (player.maxEnergy < GAME_CONSTANTS.MAX_ENERGY) {
      player.maxEnergy++;
    }
    player.energy = player.maxEnergy;

    // Reset unit attack states
    for (const unit of player.board) {
      unit.canAttack = true;
      unit.attacksThisTurn = 0;

      // Regenerate
      if (unit.keywords.includes(CardKeyword.REGENERATE)) {
        unit.currentHp = Math.min(unit.currentHp + 1, unit.defense);
      }
    }

    // Process turn start effects
    this.processTurnStartEffects(player);

    this.state.phase = GamePhase.MAIN;

    this.emitEvent(MatchEventType.TURN_START, this.state.activePlayerId, {
      turn: this.state.currentTurn,
    });
  }

  private drawCard(player: PlayerState): void {
    if (player.deck.length === 0) {
      // Deck out damage
      player.nexusHp -= 1;
      this.checkWinCondition();
      return;
    }

    if (player.hand.length >= GAME_CONSTANTS.MAX_HAND_SIZE) {
      // Burn card
      const cardId = player.deck.shift()!;
      player.graveyard.push(cardId);
      return;
    }

    const cardId = player.deck.shift()!;
    const cardDef = this.cardDefinitions.get(cardId);
    if (!cardDef) return;

    const cardInstance = this.createCardInstance(cardDef);
    player.hand.push(cardInstance);

    this.emitEvent(MatchEventType.CARD_DRAWN, player.userId, {
      cardInstanceId: cardInstance.instanceId,
    });
  }

  private createCardInstance(cardDef: CardDefinition): CardInstance {
    return {
      instanceId: generateCardInstanceId(),
      cardDefinitionId: cardDef.id,
      attack: cardDef.attack || 0,
      defense: cardDef.defense || 0,
      currentHp: cardDef.defense || 0,
      keywords: [...cardDef.keywords],
      effects: [],
      canAttack: false,
      attacksThisTurn: 0,
    };
  }

  private destroyUnit(player: PlayerState, unit: CardInstance): void {
    const index = player.board.indexOf(unit);
    if (index !== -1) {
      player.board.splice(index, 1);
      player.graveyard.push(unit.cardDefinitionId);

      this.emitEvent(MatchEventType.UNIT_DESTROYED, player.userId, {
        cardInstanceId: unit.instanceId,
      });

      // Trigger ON_DEATH abilities
      this.executeCardAbilities(unit, player, AbilityTrigger.ON_DEATH);
    }
  }

  private executeCardAbilities(
    card: CardInstance,
    player: PlayerState,
    trigger: AbilityTrigger
  ): void {
    const cardDef = this.cardDefinitions.get(card.cardDefinitionId);
    if (!cardDef) return;

    for (const ability of cardDef.abilities) {
      if (ability.trigger === trigger) {
        this.executeAbilityEffect(ability.effect, player, card);
      }
    }
  }

  private executeAbilityEffect(
    effect: any,
    player: PlayerState,
    source: CardInstance
  ): void {
    // Simplified effect execution
    // In real implementation, this would be much more complex
    switch (effect.type) {
      case EffectType.DAMAGE:
        // Deal damage to target
        break;
      case EffectType.HEAL:
        // Heal target
        break;
      case EffectType.DRAW_CARD:
        this.drawCard(player);
        break;
      // ... other effects
    }
  }

  private processTurnStartEffects(player: PlayerState): void {
    // Process effects that trigger at turn start
    for (const unit of player.board) {
      this.executeCardAbilities(unit, player, AbilityTrigger.ON_TURN_START);
    }
  }

  private checkWinCondition(): void {
    for (const player of this.state.players) {
      if (player.nexusHp <= 0) {
        const opponent = this.getOpponent(player.userId);
        this.emitEvent(MatchEventType.GAME_END, opponent.userId, {
          winnerId: opponent.userId,
          reason: 'nexus_destroyed',
        });
      }
    }
  }

  // ============================================================================
  // VALIDATION
  // ============================================================================

  private validateAction(action: GameAction): void {
    const player = this.getPlayer(action.playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    if (
      action.type !== GameActionType.MULLIGAN &&
      action.type !== GameActionType.SURRENDER &&
      this.state.activePlayerId !== action.playerId
    ) {
      throw new Error('Not your turn');
    }
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private getPlayer(userId: string): PlayerState {
    const player = this.state.players.find((p) => p.userId === userId);
    if (!player) throw new Error('Player not found');
    return player;
  }

  private getOpponent(userId: string): PlayerState {
    const opponent = this.state.players.find((p) => p.userId !== userId);
    if (!opponent) throw new Error('Opponent not found');
    return opponent;
  }

  private emitEvent(type: MatchEventType, playerId: string, data: any): void {
    this.events.push({
      id: `event-${Date.now()}-${Math.random()}`,
      matchId: this.state.matchId,
      type,
      playerId,
      timestamp: new Date(),
      data,
    });
  }
}
