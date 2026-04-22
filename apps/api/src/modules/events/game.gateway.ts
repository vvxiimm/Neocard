import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameEngine } from '@nexus/game-core';
import { MatchmakingService } from '@nexus/game-core';
import { GameAction, GameMode, CardDefinition } from '@nexus/shared';
import { PrismaService } from '../../database/prisma.service';

interface ActiveMatch {
  matchId: string;
  engine: GameEngine;
  players: string[];
  sockets: Map<string, Socket>;
}

@WebSocketGateway({ cors: true, namespace: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeMatches = new Map<string, ActiveMatch>();
  private matchmaking = new MatchmakingService();
  private playerToMatch = new Map<string, string>();

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`🎮 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`👋 Client disconnected: ${client.id}`);

    // Handle player disconnect from active match
    const matchId = this.playerToMatch.get(client.id);
    if (matchId) {
      const match = this.activeMatches.get(matchId);
      if (match) {
        // Notify other player
        match.sockets.forEach((socket, playerId) => {
          if (socket.id !== client.id) {
            socket.emit('match:opponent_disconnected');
          }
        });
      }
    }
  }

  @SubscribeMessage('match:queue:join')
  async handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { mode: GameMode; deckId: string; userId: string }
  ) {
    console.log(`🎯 Player joining queue:`, data);

    // Add to matchmaking queue
    this.matchmaking.addToQueue({
      userId: data.userId,
      mode: data.mode,
      deckId: data.deckId,
      mmr: 1000, // TODO: get from user profile
    });

    // Try to find match
    const matchResult = this.matchmaking.findMatch(data.mode);

    if (matchResult) {
      // Match found! Create game
      await this.createMatch(matchResult.player1, matchResult.player2);
    } else {
      // Still waiting
      client.emit('match:queue:waiting', {
        position: this.matchmaking.getQueuePosition(data.userId, data.mode),
        queueSize: this.matchmaking.getQueueSize(data.mode),
      });
    }
  }

  @SubscribeMessage('match:queue:leave')
  handleLeaveQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { mode: GameMode; userId: string }
  ) {
    this.matchmaking.removeFromQueue(data.userId, data.mode);
    client.emit('match:queue:left');
  }

  @SubscribeMessage('match:join')
  async handleJoinMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; userId: string }
  ) {
    const match = this.activeMatches.get(data.matchId);
    if (!match) {
      client.emit('error', { message: 'Match not found' });
      return;
    }

    // Add socket to match
    match.sockets.set(data.userId, client);
    this.playerToMatch.set(client.id, data.matchId);

    // Send current game state
    client.emit('match:state', match.engine.getState());
  }

  @SubscribeMessage('match:action')
  async handleMatchAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; action: GameAction }
  ) {
    const match = this.activeMatches.get(data.matchId);
    if (!match) {
      client.emit('error', { message: 'Match not found' });
      return;
    }

    // Process action through game engine
    const result = match.engine.processAction(data.action);

    if (result.success) {
      // Broadcast new state to all players
      match.sockets.forEach((socket) => {
        socket.emit('match:state', result.newState);
      });

      // Broadcast events
      result.events.forEach((event) => {
        match.sockets.forEach((socket) => {
          socket.emit('match:event', event);
        });
      });

      // Check if match ended
      if (result.newState.phase === 'END') {
        await this.endMatch(data.matchId, result.newState);
      }
    } else {
      // Send error to player
      client.emit('match:action:error', { error: result.error });
    }
  }

  private async createMatch(player1: any, player2: any) {
    console.log(`🎮 Creating match: ${player1.userId} vs ${player2.userId}`);

    // Get decks
    const deck1 = await this.prisma.deck.findUnique({
      where: { id: player1.deckId },
      include: { cards: true },
    });

    const deck2 = await this.prisma.deck.findUnique({
      where: { id: player2.deckId },
      include: { cards: true },
    });

    if (!deck1 || !deck2) {
      console.error('❌ Decks not found');
      return;
    }

    // Get card definitions
    const cardIds = [
      ...deck1.cards.map((c: any) => c.cardDefinitionId),
      ...deck2.cards.map((c: any) => c.cardDefinitionId),
    ];

    const cardDefinitions = await this.prisma.cardDefinition.findMany({
      where: { id: { in: cardIds } },
    });

    // Create match in database
    const match = await this.prisma.match.create({
      data: {
        mode: player1.mode,
        status: 'IN_PROGRESS',
        players: {
          create: [
            { userId: player1.userId, deckId: player1.deckId },
            { userId: player2.userId, deckId: player2.deckId },
          ],
        },
        startedAt: new Date(),
      },
    });

    // Create game engine
    const engine = new GameEngine(
      match.id,
      player1.userId,
      deck1.cards.flatMap((c: any) => Array(c.count).fill(c.cardDefinitionId)),
      player2.userId,
      deck2.cards.flatMap((c: any) => Array(c.count).fill(c.cardDefinitionId)),
      cardDefinitions.map((c: any) => ({
        ...c,
        abilities: JSON.parse(c.abilities as string),
      })) as CardDefinition[]
    );

    // Start game
    engine.startGame();

    // Store active match
    const activeMatch: ActiveMatch = {
      matchId: match.id,
      engine,
      players: [player1.userId, player2.userId],
      sockets: new Map(),
    };

    this.activeMatches.set(match.id, activeMatch);

    // Notify players
    // TODO: Get sockets for players and emit match:found
    console.log(`✅ Match created: ${match.id}`);
  }

  private async endMatch(matchId: string, finalState: any) {
    const match = this.activeMatches.get(matchId);
    if (!match) return;

    // Determine winner
    const winner = finalState.players.find((p: any) => p.nexusHp > 0);
    const loser = finalState.players.find((p: any) => p.nexusHp <= 0);

    // Update database
    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'FINISHED',
        winnerId: winner?.userId,
        endedAt: new Date(),
      },
    });

    // Update player stats and give rewards
    if (winner && loser) {
      await this.giveMatchRewards(winner.userId, 'WIN');
      await this.giveMatchRewards(loser.userId, 'LOSS');
    }

    // Notify players
    match.sockets.forEach((socket, playerId) => {
      const isWinner = playerId === winner?.userId;
      socket.emit('match:end', {
        result: isWinner ? 'WIN' : 'LOSS',
        rewards: {
          credits: isWinner ? 50 : 20,
          xp: isWinner ? 100 : 50,
        },
      });
    });

    // Clean up
    this.activeMatches.delete(matchId);
    match.sockets.forEach((socket) => {
      this.playerToMatch.delete(socket.id);
    });
  }

  private async giveMatchRewards(userId: string, result: 'WIN' | 'LOSS') {
    const credits = result === 'WIN' ? 50 : 20;
    const xp = result === 'WIN' ? 100 : 50;

    // Update currency
    await this.prisma.currency.update({
      where: {
        userId_type: {
          userId,
          type: 'CREDITS',
        },
      },
      data: {
        amount: { increment: credits },
      },
    });

    // Update profile XP
    await this.prisma.profile.update({
      where: { userId },
      data: {
        xp: { increment: xp },
        totalMatches: { increment: 1 },
        totalWins: result === 'WIN' ? { increment: 1 } : undefined,
        totalLosses: result === 'LOSS' ? { increment: 1 } : undefined,
        winStreak: result === 'WIN' ? { increment: 1 } : 0,
      },
    });

    // Create transaction record
    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'MATCH_REWARD',
        currencyType: 'CREDITS',
        amount: credits,
        balanceBefore: 0, // TODO: get actual balance
        balanceAfter: 0, // TODO: calculate
        metadata: { result },
      },
    });
  }
}
