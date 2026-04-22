import {
  GameState,
  PlayerState,
  GameAction,
  GameActionType,
  CardInstance,
  CardKeyword,
} from '@nexus/shared';

export enum AIDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  BOSS = 'BOSS',
}

export class AIOpponent {
  private difficulty: AIDifficulty;
  private playerId: string;

  constructor(playerId: string, difficulty: AIDifficulty = AIDifficulty.NORMAL) {
    this.playerId = playerId;
    this.difficulty = difficulty;
  }

  public decideAction(gameState: GameState): GameAction | null {
    const player = this.getPlayerState(gameState);
    if (!player) return null;

    // If not AI's turn, return null
    if (gameState.activePlayerId !== this.playerId) return null;

    // Decide based on difficulty
    switch (this.difficulty) {
      case AIDifficulty.EASY:
        return this.easyAI(gameState, player);
      case AIDifficulty.NORMAL:
        return this.normalAI(gameState, player);
      case AIDifficulty.HARD:
        return this.hardAI(gameState, player);
      case AIDifficulty.BOSS:
        return this.bossAI(gameState, player);
      default:
        return this.normalAI(gameState, player);
    }
  }

  // ============================================================================
  // EASY AI - Random plays, no strategy
  // ============================================================================

  private easyAI(gameState: GameState, player: PlayerState): GameAction {
    // 30% chance to just end turn
    if (Math.random() < 0.3) {
      return {
        type: GameActionType.END_TURN,
        playerId: this.playerId,
        data: {},
      };
    }

    // Try to play a random card
    const playableCards = this.getPlayableCards(player);
    if (playableCards.length > 0 && Math.random() < 0.7) {
      const card = playableCards[Math.floor(Math.random() * playableCards.length)];
      return {
        type: GameActionType.PLAY_CARD,
        playerId: this.playerId,
        data: {
          cardInstanceId: card.instanceId,
        },
      };
    }

    // Try to attack with a random unit
    const attackers = this.getAvailableAttackers(player);
    if (attackers.length > 0 && Math.random() < 0.5) {
      const attacker = attackers[Math.floor(Math.random() * attackers.length)];
      return {
        type: GameActionType.ATTACK,
        playerId: this.playerId,
        data: {
          attackerId: attacker.instanceId,
          targetId: 'nexus',
        },
      };
    }

    // End turn
    return {
      type: GameActionType.END_TURN,
      playerId: this.playerId,
      data: {},
    };
  }

  // ============================================================================
  // NORMAL AI - Basic strategy
  // ============================================================================

  private normalAI(gameState: GameState, player: PlayerState): GameAction {
    const opponent = this.getOpponentState(gameState);
    if (!opponent) {
      return { type: GameActionType.END_TURN, playerId: this.playerId, data: {} };
    }

    // 1. Play cards if we have energy
    const playableCards = this.getPlayableCards(player);
    if (playableCards.length > 0) {
      // Prioritize low-cost cards
      playableCards.sort((a, b) => {
        const aCost = this.getCardCost(a);
        const bCost = this.getCardCost(b);
        return aCost - bCost;
      });

      const card = playableCards[0];
      return {
        type: GameActionType.PLAY_CARD,
        playerId: this.playerId,
        data: {
          cardInstanceId: card.instanceId,
        },
      };
    }

    // 2. Attack with units
    const attackers = this.getAvailableAttackers(player);
    if (attackers.length > 0) {
      const attacker = attackers[0];

      // If opponent has units, attack them
      if (opponent.board.length > 0) {
        const target = opponent.board[0];
        return {
          type: GameActionType.ATTACK,
          playerId: this.playerId,
          data: {
            attackerId: attacker.instanceId,
            targetId: target.instanceId,
          },
        };
      }

      // Otherwise attack nexus
      return {
        type: GameActionType.ATTACK,
        playerId: this.playerId,
        data: {
          attackerId: attacker.instanceId,
          targetId: 'nexus',
        },
      };
    }

    // 3. End turn
    return {
      type: GameActionType.END_TURN,
      playerId: this.playerId,
      data: {},
    };
  }

  // ============================================================================
  // HARD AI - Advanced strategy
  // ============================================================================

  private hardAI(gameState: GameState, player: PlayerState): GameAction {
    const opponent = this.getOpponentState(gameState);
    if (!opponent) {
      return { type: GameActionType.END_TURN, playerId: this.playerId, data: {} };
    }

    // 1. Evaluate board state
    const boardValue = this.evaluateBoardState(player, opponent);

    // 2. Play cards strategically
    const playableCards = this.getPlayableCards(player);
    if (playableCards.length > 0) {
      // Prioritize based on situation
      const sortedCards = this.prioritizeCards(playableCards, player, opponent);
      const card = sortedCards[0];

      return {
        type: GameActionType.PLAY_CARD,
        playerId: this.playerId,
        data: {
          cardInstanceId: card.instanceId,
        },
      };
    }

    // 3. Attack strategically
    const attackers = this.getAvailableAttackers(player);
    if (attackers.length > 0) {
      // Calculate best attacks
      const bestAttack = this.calculateBestAttack(attackers, opponent);
      if (bestAttack) {
        return {
          type: GameActionType.ATTACK,
          playerId: this.playerId,
          data: bestAttack,
        };
      }
    }

    // 4. End turn
    return {
      type: GameActionType.END_TURN,
      playerId: this.playerId,
      data: {},
    };
  }

  // ============================================================================
  // BOSS AI - Cheating AI with special rules
  // ============================================================================

  private bossAI(gameState: GameState, player: PlayerState): GameAction {
    // Boss AI uses hard AI logic but with better decision making
    return this.hardAI(gameState, player);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private getPlayerState(gameState: GameState): PlayerState | null {
    return gameState.players.find((p) => p.userId === this.playerId) || null;
  }

  private getOpponentState(gameState: GameState): PlayerState | null {
    return gameState.players.find((p) => p.userId !== this.playerId) || null;
  }

  private getPlayableCards(player: PlayerState): CardInstance[] {
    return player.hand.filter((card) => {
      const cost = this.getCardCost(card);
      return cost <= player.energy;
    });
  }

  private getAvailableAttackers(player: PlayerState): CardInstance[] {
    return player.board.filter((unit) => unit.canAttack && unit.attacksThisTurn === 0);
  }

  private getCardCost(card: CardInstance): number {
    // In real implementation, get from card definition
    return 3; // Placeholder
  }

  private evaluateBoardState(player: PlayerState, opponent: PlayerState): number {
    let value = 0;

    // Player board value
    for (const unit of player.board) {
      value += unit.attack + unit.defense;
    }

    // Opponent board value (negative)
    for (const unit of opponent.board) {
      value -= unit.attack + unit.defense;
    }

    // HP difference
    value += (player.nexusHp - opponent.nexusHp) * 2;

    return value;
  }

  private prioritizeCards(
    cards: CardInstance[],
    player: PlayerState,
    opponent: PlayerState
  ): CardInstance[] {
    return cards.sort((a, b) => {
      const aValue = this.evaluateCardValue(a, player, opponent);
      const bValue = this.evaluateCardValue(b, player, opponent);
      return bValue - aValue;
    });
  }

  private evaluateCardValue(
    card: CardInstance,
    player: PlayerState,
    opponent: PlayerState
  ): number {
    let value = card.attack + card.defense;

    // Bonus for keywords
    if (card.keywords.includes(CardKeyword.RUSH)) value += 2;
    if (card.keywords.includes(CardKeyword.GUARD)) value += 3;
    if (card.keywords.includes(CardKeyword.LIFESTEAL)) value += 2;

    // Situational bonuses
    if (opponent.board.length > player.board.length) {
      // Need board presence
      value += 2;
    }

    if (player.nexusHp < 10) {
      // Need defense
      if (card.keywords.includes(CardKeyword.GUARD)) value += 5;
    }

    return value;
  }

  private calculateBestAttack(
    attackers: CardInstance[],
    opponent: PlayerState
  ): { attackerId: string; targetId: string } | null {
    if (attackers.length === 0) return null;

    // Simple strategy: attack weakest enemy unit or nexus
    if (opponent.board.length > 0) {
      const weakestEnemy = opponent.board.reduce((weakest, unit) =>
        unit.currentHp < weakest.currentHp ? unit : weakest
      );

      const attacker = attackers.find((a) => a.attack >= weakestEnemy.currentHp);
      if (attacker) {
        return {
          attackerId: attacker.instanceId,
          targetId: weakestEnemy.instanceId,
        };
      }
    }

    // Attack nexus
    return {
      attackerId: attackers[0].instanceId,
      targetId: 'nexus',
    };
  }
}
