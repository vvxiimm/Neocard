import { create } from 'zustand';
import { GameState, GameAction, GameActionType } from '@nexus/shared';
import { io, Socket } from 'socket.io-client';

interface GameStore {
  socket: Socket | null;
  gameState: GameState | null;
  matchId: string | null;
  isConnected: boolean;

  // Actions
  connectToMatch: (matchId: string) => void;
  disconnect: () => void;
  playCard: (cardInstanceId: string, targetId?: string) => void;
  attack: (attackerId: string, targetId: string) => void;
  endTurn: () => void;
  surrender: () => void;

  // Internal
  setGameState: (state: GameState) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  socket: null,
  gameState: null,
  matchId: null,
  isConnected: false,

  connectToMatch: (matchId: string) => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Connected to game server');
      set({ isConnected: true, socket, matchId });

      // Join match
      socket.emit('match:join', { matchId });
    });

    socket.on('match:state', (state: GameState) => {
      console.log('📊 Game state updated', state);
      set({ gameState: state });
    });

    socket.on('match:event', (event: any) => {
      console.log('🎮 Game event', event);
    });

    socket.on('match:end', (result: any) => {
      console.log('🏁 Match ended', result);
      // Update game state to show end screen
      const currentState = get().gameState;
      if (currentState) {
        set({
          gameState: {
            ...currentState,
            phase: 'END' as any,
          },
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from game server');
      set({ isConnected: false });
    });

    socket.on('error', (error: any) => {
      console.error('❌ Socket error', error);
    });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, gameState: null, matchId: null, isConnected: false });
    }
  },

  playCard: (cardInstanceId: string, targetId?: string) => {
    const { socket, matchId } = get();
    if (!socket || !matchId) return;

    const action: GameAction = {
      type: GameActionType.PLAY_CARD,
      playerId: 'player1', // TODO: get from auth
      data: {
        cardInstanceId,
        targetId,
      },
    };

    socket.emit('match:action', { matchId, action });
  },

  attack: (attackerId: string, targetId: string) => {
    const { socket, matchId } = get();
    if (!socket || !matchId) return;

    const action: GameAction = {
      type: GameActionType.ATTACK,
      playerId: 'player1', // TODO: get from auth
      data: {
        attackerId,
        targetId,
      },
    };

    socket.emit('match:action', { matchId, action });
  },

  endTurn: () => {
    const { socket, matchId } = get();
    if (!socket || !matchId) return;

    const action: GameAction = {
      type: GameActionType.END_TURN,
      playerId: 'player1', // TODO: get from auth
      data: {},
    };

    socket.emit('match:action', { matchId, action });
  },

  surrender: () => {
    const { socket, matchId } = get();
    if (!socket || !matchId) return;

    const action: GameAction = {
      type: GameActionType.SURRENDER,
      playerId: 'player1', // TODO: get from auth
      data: {},
    };

    socket.emit('match:action', { matchId, action });
  },

  setGameState: (state: GameState) => {
    set({ gameState: state });
  },
}));
