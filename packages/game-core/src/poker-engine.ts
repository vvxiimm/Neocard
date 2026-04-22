import {
  PokerTable,
  PokerPlayer,
  PokerTableState,
  PokerPhase,
  PokerPlayerStatus,
  PokerAction,
  PokerHandRank,
} from '@nexus/shared';

interface Card {
  rank: string;
  suit: string;
}

export class PokerEngine {
  private table: PokerTable;
  private deck: Card[] = [];

  constructor(tableConfig: {
    id: string;
    name: string;
    maxPlayers: number;
    smallBlind: number;
    bigBlind: number;
    minBuyIn: number;
    maxBuyIn: number;
  }) {
    this.table = {
      ...tableConfig,
      players: [],
      state: {
        phase: PokerPhase.WAITING,
        pot: 0,
        communityCards: [],
        currentBet: 0,
        activePlayerIndex: 0,
      },
    };
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  public getTable(): PokerTable {
    return JSON.parse(JSON.stringify(this.table));
  }

  public addPlayer(userId: string, buyIn: number, seatIndex: number): void {
    if (this.table.players.length >= this.table.maxPlayers) {
      throw new Error('Table is full');
    }

    if (buyIn < this.table.minBuyIn || buyIn > this.table.maxBuyIn) {
      throw new Error('Invalid buy-in amount');
    }

    if (this.table.players.some((p) => p.seatIndex === seatIndex)) {
      throw new Error('Seat already taken');
    }

    const player: PokerPlayer = {
      userId,
      seatIndex,
      chips: buyIn,
      cards: [],
      status: PokerPlayerStatus.WAITING,
      currentBet: 0,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
    };

    this.table.players.push(player);

    // Start game if enough players
    if (this.table.players.length >= 2 && this.table.state.phase === PokerPhase.WAITING) {
      this.startHand();
    }
  }

  public removePlayer(userId: string): void {
    const index = this.table.players.findIndex((p) => p.userId === userId);
    if (index !== -1) {
      this.table.players.splice(index, 1);
    }
  }

  public processAction(userId: string, action: PokerAction, amount?: number): {
    success: boolean;
    error?: string;
    newState: PokerTableState;
  } {
    try {
      const player = this.getPlayer(userId);

      if (this.table.players[this.table.state.activePlayerIndex].userId !== userId) {
        throw new Error('Not your turn');
      }

      switch (action) {
        case PokerAction.FOLD:
          this.handleFold(player);
          break;
        case PokerAction.CHECK:
          this.handleCheck(player);
          break;
        case PokerAction.CALL:
          this.handleCall(player);
          break;
        case PokerAction.RAISE:
          if (amount === undefined) throw new Error('Raise amount required');
          this.handleRaise(player, amount);
          break;
        case PokerAction.ALL_IN:
          this.handleAllIn(player);
          break;
      }

      this.moveToNextPlayer();
      this.checkPhaseComplete();

      return {
        success: true,
        newState: this.table.state,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        newState: this.table.state,
      };
    }
  }

  // ============================================================================
  // HAND FLOW
  // ============================================================================

  private startHand(): void {
    // Reset table state
    this.table.state = {
      phase: PokerPhase.PRE_FLOP,
      pot: 0,
      communityCards: [],
      currentBet: this.table.bigBlind,
      activePlayerIndex: 0,
    };

    // Reset players
    for (const player of this.table.players) {
      player.cards = [];
      player.status = PokerPlayerStatus.ACTIVE;
      player.currentBet = 0;
      player.isDealer = false;
      player.isSmallBlind = false;
      player.isBigBlind = false;
    }

    // Assign dealer, blinds
    this.assignPositions();

    // Create and shuffle deck
    this.deck = this.createDeck();
    this.shuffleDeck();

    // Deal hole cards
    for (const player of this.table.players) {
      player.cards = [this.dealCard(), this.dealCard()];
    }

    // Post blinds
    this.postBlinds();

    // Set first player to act (after big blind)
    this.table.state.activePlayerIndex = this.getNextActivePlayerIndex(
      this.getBigBlindIndex()
    );
  }

  private assignPositions(): void {
    if (this.table.players.length < 2) return;

    // Simplified: first player is dealer
    this.table.players[0].isDealer = true;

    if (this.table.players.length === 2) {
      // Heads up: dealer is small blind
      this.table.players[0].isSmallBlind = true;
      this.table.players[1].isBigBlind = true;
    } else {
      // Multi-way: dealer, then small blind, then big blind
      this.table.players[1].isSmallBlind = true;
      this.table.players[2].isBigBlind = true;
    }
  }

  private postBlinds(): void {
    const sbPlayer = this.table.players.find((p) => p.isSmallBlind);
    const bbPlayer = this.table.players.find((p) => p.isBigBlind);

    if (sbPlayer) {
      const sbAmount = Math.min(this.table.smallBlind, sbPlayer.chips);
      sbPlayer.chips -= sbAmount;
      sbPlayer.currentBet = sbAmount;
      this.table.state.pot += sbAmount;
    }

    if (bbPlayer) {
      const bbAmount = Math.min(this.table.bigBlind, bbPlayer.chips);
      bbPlayer.chips -= bbAmount;
      bbPlayer.currentBet = bbAmount;
      this.table.state.pot += bbAmount;
    }
  }

  private moveToNextPlayer(): void {
    this.table.state.activePlayerIndex = this.getNextActivePlayerIndex(
      this.table.state.activePlayerIndex
    );
  }

  private getNextActivePlayerIndex(currentIndex: number): number {
    let nextIndex = (currentIndex + 1) % this.table.players.length;
    let iterations = 0;

    while (
      this.table.players[nextIndex].status !== PokerPlayerStatus.ACTIVE &&
      iterations < this.table.players.length
    ) {
      nextIndex = (nextIndex + 1) % this.table.players.length;
      iterations++;
    }

    return nextIndex;
  }

  private checkPhaseComplete(): void {
    // Check if all active players have acted and matched the current bet
    const activePlayers = this.table.players.filter(
      (p) => p.status === PokerPlayerStatus.ACTIVE
    );

    if (activePlayers.length === 1) {
      // Only one player left, they win
      this.endHand(activePlayers[0].userId);
      return;
    }

    const allMatched = activePlayers.every(
      (p) => p.currentBet === this.table.state.currentBet || p.chips === 0
    );

    if (allMatched) {
      this.advancePhase();
    }
  }

  private advancePhase(): void {
    // Reset current bets
    for (const player of this.table.players) {
      player.currentBet = 0;
    }
    this.table.state.currentBet = 0;

    switch (this.table.state.phase) {
      case PokerPhase.PRE_FLOP:
        this.dealFlop();
        this.table.state.phase = PokerPhase.FLOP;
        break;
      case PokerPhase.FLOP:
        this.dealTurn();
        this.table.state.phase = PokerPhase.TURN;
        break;
      case PokerPhase.TURN:
        this.dealRiver();
        this.table.state.phase = PokerPhase.RIVER;
        break;
      case PokerPhase.RIVER:
        this.showdown();
        break;
    }

    // Reset to first active player after dealer
    this.table.state.activePlayerIndex = this.getNextActivePlayerIndex(
      this.getDealerIndex()
    );
  }

  private dealFlop(): void {
    this.table.state.communityCards = [
      this.dealCard(),
      this.dealCard(),
      this.dealCard(),
    ];
  }

  private dealTurn(): void {
    this.table.state.communityCards.push(this.dealCard());
  }

  private dealRiver(): void {
    this.table.state.communityCards.push(this.dealCard());
  }

  private showdown(): void {
    const activePlayers = this.table.players.filter(
      (p) => p.status === PokerPlayerStatus.ACTIVE
    );

    if (activePlayers.length === 0) return;

    // Evaluate hands
    const hands = activePlayers.map((p) => ({
      player: p,
      hand: this.evaluateHand([...p.cards, ...this.table.state.communityCards]),
    }));

    // Find winner (simplified)
    hands.sort((a, b) => b.hand.value - a.hand.value);
    const winner = hands[0].player;

    this.endHand(winner.userId);
  }

  private endHand(winnerId: string): void {
    const winner = this.getPlayer(winnerId);
    winner.chips += this.table.state.pot;

    // Start new hand if enough players
    if (this.table.players.length >= 2) {
      setTimeout(() => this.startHand(), 3000);
    } else {
      this.table.state.phase = PokerPhase.WAITING;
    }
  }

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  private handleFold(player: PokerPlayer): void {
    player.status = PokerPlayerStatus.FOLDED;
  }

  private handleCheck(player: PokerPlayer): void {
    if (player.currentBet < this.table.state.currentBet) {
      throw new Error('Cannot check, must call or raise');
    }
  }

  private handleCall(player: PokerPlayer): void {
    const callAmount = this.table.state.currentBet - player.currentBet;
    const actualAmount = Math.min(callAmount, player.chips);

    player.chips -= actualAmount;
    player.currentBet += actualAmount;
    this.table.state.pot += actualAmount;

    if (player.chips === 0) {
      player.status = PokerPlayerStatus.ALL_IN;
    }
  }

  private handleRaise(player: PokerPlayer, amount: number): void {
    const totalBet = this.table.state.currentBet + amount;

    if (totalBet > player.chips + player.currentBet) {
      throw new Error('Insufficient chips');
    }

    const raiseAmount = totalBet - player.currentBet;
    player.chips -= raiseAmount;
    player.currentBet = totalBet;
    this.table.state.pot += raiseAmount;
    this.table.state.currentBet = totalBet;

    if (player.chips === 0) {
      player.status = PokerPlayerStatus.ALL_IN;
    }
  }

  private handleAllIn(player: PokerPlayer): void {
    const allInAmount = player.chips;
    player.chips = 0;
    player.currentBet += allInAmount;
    this.table.state.pot += allInAmount;
    player.status = PokerPlayerStatus.ALL_IN;

    if (player.currentBet > this.table.state.currentBet) {
      this.table.state.currentBet = player.currentBet;
    }
  }

  // ============================================================================
  // DECK & CARDS
  // ============================================================================

  private createDeck(): Card[] {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const suits = ['♠', '♥', '♦', '♣'];
    const deck: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ rank, suit });
      }
    }

    return deck;
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  private dealCard(): string {
    const card = this.deck.pop();
    if (!card) throw new Error('Deck is empty');
    return `${card.rank}${card.suit}`;
  }

  private evaluateHand(cards: string[]): { rank: PokerHandRank; value: number } {
    // Simplified hand evaluation
    // In production, use a proper poker hand evaluator library
    return {
      rank: PokerHandRank.HIGH_CARD,
      value: Math.random() * 1000, // Placeholder
    };
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private getPlayer(userId: string): PokerPlayer {
    const player = this.table.players.find((p) => p.userId === userId);
    if (!player) throw new Error('Player not found');
    return player;
  }

  private getDealerIndex(): number {
    return this.table.players.findIndex((p) => p.isDealer);
  }

  private getBigBlindIndex(): number {
    return this.table.players.findIndex((p) => p.isBigBlind);
  }
}
