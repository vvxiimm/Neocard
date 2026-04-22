import { GAME_CONSTANTS } from './constants';
import { CardRarity, RankTier } from './enums';

// ============================================================================
// XP & LEVELING UTILITIES
// ============================================================================

export function calculateXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(
    GAME_CONSTANTS.BASE_XP_PER_LEVEL *
      Math.pow(GAME_CONSTANTS.XP_SCALING_FACTOR, level - 1)
  );
}

export function calculateLevelFromXp(xp: number): number {
  let level = 1;
  let totalXp = 0;

  while (level < GAME_CONSTANTS.MAX_LEVEL) {
    const xpForNextLevel = calculateXpForLevel(level + 1);
    if (totalXp + xpForNextLevel > xp) break;
    totalXp += xpForNextLevel;
    level++;
  }

  return level;
}

export function getXpProgressForCurrentLevel(xp: number): {
  currentLevel: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number;
} {
  const currentLevel = calculateLevelFromXp(xp);
  const currentLevelTotalXp = Array.from({ length: currentLevel }, (_, i) =>
    calculateXpForLevel(i + 1)
  ).reduce((sum, val) => sum + val, 0);

  const currentLevelXp = xp - currentLevelTotalXp;
  const nextLevelXp = calculateXpForLevel(currentLevel + 1);
  const progress = nextLevelXp > 0 ? currentLevelXp / nextLevelXp : 1;

  return {
    currentLevel,
    currentLevelXp,
    nextLevelXp,
    progress,
  };
}

// ============================================================================
// RANK UTILITIES
// ============================================================================

export function getRankFromPoints(points: number): {
  tier: RankTier;
  division: number;
} {
  const tiers = [
    RankTier.BRONZE,
    RankTier.SILVER,
    RankTier.GOLD,
    RankTier.PLATINUM,
    RankTier.DIAMOND,
    RankTier.MASTER,
    RankTier.GRANDMASTER,
  ];

  let remainingPoints = points;
  let currentTier = RankTier.BRONZE;
  let division = 5;

  for (const tier of tiers) {
    const tierPoints =
      GAME_CONSTANTS.DIVISIONS_PER_TIER * GAME_CONSTANTS.RANK_POINTS_PER_DIVISION;

    if (tier === RankTier.MASTER || tier === RankTier.GRANDMASTER) {
      if (tier === RankTier.MASTER && remainingPoints < 500) {
        currentTier = RankTier.MASTER;
        division = 1;
        break;
      } else if (tier === RankTier.GRANDMASTER) {
        currentTier = RankTier.GRANDMASTER;
        division = 1;
        break;
      }
      remainingPoints -= 500;
    } else {
      if (remainingPoints < tierPoints) {
        currentTier = tier;
        division = 5 - Math.floor(remainingPoints / GAME_CONSTANTS.RANK_POINTS_PER_DIVISION);
        break;
      }
      remainingPoints -= tierPoints;
    }
  }

  return { tier: currentTier, division };
}

export function getPointsForRank(tier: RankTier, division: number): number {
  const tiers = [
    RankTier.BRONZE,
    RankTier.SILVER,
    RankTier.GOLD,
    RankTier.PLATINUM,
    RankTier.DIAMOND,
  ];

  let points = 0;
  const tierIndex = tiers.indexOf(tier);

  if (tierIndex > 0) {
    points =
      tierIndex *
      GAME_CONSTANTS.DIVISIONS_PER_TIER *
      GAME_CONSTANTS.RANK_POINTS_PER_DIVISION;
  }

  if (tier === RankTier.MASTER) {
    points = 2500;
  } else if (tier === RankTier.GRANDMASTER) {
    points = 3000;
  } else {
    points += (5 - division) * GAME_CONSTANTS.RANK_POINTS_PER_DIVISION;
  }

  return points;
}

// ============================================================================
// CURRENCY UTILITIES
// ============================================================================

export function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (compact && amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toLocaleString();
}

// ============================================================================
// CARD UTILITIES
// ============================================================================

export function getCardRarityWeight(rarity: CardRarity): number {
  const weights = {
    [CardRarity.COMMON]: 1,
    [CardRarity.RARE]: 2,
    [CardRarity.EPIC]: 5,
    [CardRarity.LEGENDARY]: 10,
    [CardRarity.MYTHIC]: 20,
  };
  return weights[rarity];
}

export function calculateDeckValue(cards: { rarity: CardRarity }[]): number {
  return cards.reduce((sum, card) => sum + getCardRarityWeight(card.rarity), 0);
}

// ============================================================================
// RANDOM UTILITIES
// ============================================================================

export function weightedRandom<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }

  return items[items.length - 1];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// TIME UTILITIES
// ============================================================================

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export function isValidDeckSize(cardCount: number, mode: string): boolean {
  if (mode === 'FAST') {
    return cardCount === GAME_CONSTANTS.DECK_SIZE_FAST;
  }
  return cardCount === GAME_CONSTANTS.DECK_SIZE;
}

export function validateDeckCards(
  cards: { cardDefinitionId: string; count: number; rarity: CardRarity }[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const cardCounts = new Map<string, number>();
  let totalCards = 0;

  for (const card of cards) {
    totalCards += card.count;
    cardCounts.set(card.cardDefinitionId, card.count);

    if (card.rarity === CardRarity.LEGENDARY && card.count > 1) {
      errors.push(`Legendary cards limited to 1 copy`);
    } else if (card.count > GAME_CONSTANTS.MAX_CARD_COPIES) {
      errors.push(`Maximum ${GAME_CONSTANTS.MAX_CARD_COPIES} copies per card`);
    }
  }

  if (totalCards !== GAME_CONSTANTS.DECK_SIZE) {
    errors.push(`Deck must contain exactly ${GAME_CONSTANTS.DECK_SIZE} cards`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// MATCH UTILITIES
// ============================================================================

export function calculateMatchRewards(
  result: 'WIN' | 'LOSS',
  winStreak: number,
  mode: string
): {
  credits: number;
  xp: number;
} {
  let credits: number =
    result === 'WIN' ? GAME_CONSTANTS.BASE_CREDITS_WIN : GAME_CONSTANTS.BASE_CREDITS_LOSS;
  let xp: number = result === 'WIN' ? GAME_CONSTANTS.BASE_XP_WIN : GAME_CONSTANTS.BASE_XP_LOSS;

  if (result === 'WIN' && winStreak > 1) {
    credits += winStreak * GAME_CONSTANTS.WIN_STREAK_BONUS_CREDITS;
    xp += winStreak * GAME_CONSTANTS.WIN_STREAK_BONUS_XP;
  }

  // Mode multipliers
  if (mode === 'RANKED') {
    credits = Math.floor(credits * 1.5);
    xp = Math.floor(xp * 1.5);
  } else if (mode === 'FAST') {
    credits = Math.floor(credits * 0.7);
    xp = Math.floor(xp * 0.7);
  }

  return { credits, xp };
}

// ============================================================================
// POKER UTILITIES
// ============================================================================

export function evaluatePokerHand(cards: string[]): {
  rank: string;
  value: number;
} {
  // Simplified poker hand evaluation
  // In real implementation, this would be much more complex
  return {
    rank: 'HIGH_CARD',
    value: 0,
  };
}

// ============================================================================
// ID GENERATION
// ============================================================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateCardInstanceId(): string {
  return `card-${generateId()}`;
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
