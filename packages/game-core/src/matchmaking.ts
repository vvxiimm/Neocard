import { GameMode } from '@nexus/shared';

interface MatchmakingRequest {
  userId: string;
  mode: GameMode;
  deckId: string;
  mmr: number;
  timestamp: number;
}

interface MatchmakingResult {
  player1: MatchmakingRequest;
  player2: MatchmakingRequest;
}

export class MatchmakingService {
  private queues: Map<GameMode, MatchmakingRequest[]> = new Map();
  private readonly MMR_RANGE_INITIAL = 100;
  private readonly MMR_RANGE_INCREASE_PER_SECOND = 10;
  private readonly MAX_WAIT_TIME_MS = 60000; // 60 seconds

  constructor() {
    // Initialize queues for each mode
    Object.values(GameMode).forEach((mode) => {
      if (mode !== GameMode.POKER) {
        this.queues.set(mode, []);
      }
    });
  }

  public addToQueue(request: Omit<MatchmakingRequest, 'timestamp'>): void {
    const queue = this.queues.get(request.mode);
    if (!queue) {
      throw new Error(`Invalid game mode: ${request.mode}`);
    }

    // Check if user already in queue
    const existing = queue.find((r) => r.userId === request.userId);
    if (existing) {
      throw new Error('User already in queue');
    }

    queue.push({
      ...request,
      timestamp: Date.now(),
    });
  }

  public removeFromQueue(userId: string, mode: GameMode): void {
    const queue = this.queues.get(mode);
    if (!queue) return;

    const index = queue.findIndex((r) => r.userId === userId);
    if (index !== -1) {
      queue.splice(index, 1);
    }
  }

  public findMatch(mode: GameMode): MatchmakingResult | null {
    const queue = this.queues.get(mode);
    if (!queue || queue.length < 2) return null;

    // Sort by wait time (oldest first)
    queue.sort((a, b) => a.timestamp - b.timestamp);

    // Try to find a match for the oldest player
    const player1 = queue[0];
    const waitTime = Date.now() - player1.timestamp;
    const mmrRange = this.MMR_RANGE_INITIAL +
      Math.floor(waitTime / 1000) * this.MMR_RANGE_INCREASE_PER_SECOND;

    // Find suitable opponent
    for (let i = 1; i < queue.length; i++) {
      const player2 = queue[i];
      const mmrDiff = Math.abs(player1.mmr - player2.mmr);

      if (mmrDiff <= mmrRange) {
        // Match found!
        queue.splice(i, 1); // Remove player2
        queue.splice(0, 1); // Remove player1

        return { player1, player2 };
      }
    }

    // If waited too long, match with anyone
    if (waitTime > this.MAX_WAIT_TIME_MS && queue.length >= 2) {
      const player2 = queue[1];
      queue.splice(1, 1);
      queue.splice(0, 1);
      return { player1, player2 };
    }

    return null;
  }

  public getQueueSize(mode: GameMode): number {
    return this.queues.get(mode)?.length || 0;
  }

  public getQueuePosition(userId: string, mode: GameMode): number {
    const queue = this.queues.get(mode);
    if (!queue) return -1;

    const index = queue.findIndex((r) => r.userId === userId);
    return index;
  }

  public isInQueue(userId: string, mode: GameMode): boolean {
    const queue = this.queues.get(mode);
    if (!queue) return false;
    return queue.some((r) => r.userId === userId);
  }

  public clearExpiredRequests(): void {
    const now = Date.now();
    const maxAge = 300000; // 5 minutes

    for (const [mode, queue] of this.queues.entries()) {
      const filtered = queue.filter((r) => now - r.timestamp < maxAge);
      this.queues.set(mode, filtered);
    }
  }
}
