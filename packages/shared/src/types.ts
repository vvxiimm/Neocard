import {
  CardRarity,
  CardType,
  Faction,
  CardKeyword,
  GameMode,
  MatchStatus,
  MatchResult,
  CurrencyType,
  RankTier,
  MatchEventType,
} from './enums';

// ============================================================================
// CARD TYPES
// ============================================================================

export interface CardDefinition {
  id: string;
  name: string;
  description: string;
  rarity: CardRarity;
  type: CardType;
  faction: Faction;
  cost: number;
  attack?: number;
  defense?: number;
  keywords: CardKeyword[];
  abilities: CardAbility[];
  artUrl: string;
  animatedArtUrl?: string;
  flavorText: string;
  tags: string[];
}

export interface CardAbility {
  id: string;
  name: string;
  description: string;
  trigger: AbilityTrigger;
  effect: AbilityEffect;
  conditions?: AbilityCondition[];
}

export enum AbilityTrigger {
  ON_PLAY = 'ON_PLAY',
  ON_DEATH = 'ON_DEATH',
  ON_ATTACK = 'ON_ATTACK',
  ON_DAMAGED = 'ON_DAMAGED',
  ON_TURN_START = 'ON_TURN_START',
  ON_TURN_END = 'ON_TURN_END',
  ON_DRAW = 'ON_DRAW',
  ON_DISCARD = 'ON_DISCARD',
  PASSIVE = 'PASSIVE',
}

export interface AbilityEffect {
  type: EffectType;
  value?: number;
  target?: TargetType;
  duration?: number;
  metadata?: Record<string, any>;
}

export enum EffectType {
  DAMAGE = 'DAMAGE',
  HEAL = 'HEAL',
  BUFF_ATTACK = 'BUFF_ATTACK',
  BUFF_DEFENSE = 'BUFF_DEFENSE',
  DEBUFF_ATTACK = 'DEBUFF_ATTACK',
  DEBUFF_DEFENSE = 'DEBUFF_DEFENSE',
  DRAW_CARD = 'DRAW_CARD',
  DISCARD_CARD = 'DISCARD_CARD',
  SUMMON_TOKEN = 'SUMMON_TOKEN',
  DESTROY_UNIT = 'DESTROY_UNIT',
  TRANSFORM = 'TRANSFORM',
  SILENCE = 'SILENCE',
  FREEZE = 'FREEZE',
  STUN = 'STUN',
  ADD_KEYWORD = 'ADD_KEYWORD',
  REMOVE_KEYWORD = 'REMOVE_KEYWORD',
}

export enum TargetType {
  SELF = 'SELF',
  ENEMY_NEXUS = 'ENEMY_NEXUS',
  FRIENDLY_NEXUS = 'FRIENDLY_NEXUS',
  ENEMY_UNIT = 'ENEMY_UNIT',
  FRIENDLY_UNIT = 'FRIENDLY_UNIT',
  ALL_ENEMY_UNITS = 'ALL_ENEMY_UNITS',
  ALL_FRIENDLY_UNITS = 'ALL_FRIENDLY_UNITS',
  ALL_UNITS = 'ALL_UNITS',
  RANDOM_ENEMY_UNIT = 'RANDOM_ENEMY_UNIT',
  RANDOM_FRIENDLY_UNIT = 'RANDOM_FRIENDLY_UNIT',
}

export interface AbilityCondition {
  type: ConditionType;
  value?: any;
}

export enum ConditionType {
  HAS_FACTION = 'HAS_FACTION',
  HAS_KEYWORD = 'HAS_KEYWORD',
  UNIT_COUNT = 'UNIT_COUNT',
  HEALTH_THRESHOLD = 'HEALTH_THRESHOLD',
  ENERGY_THRESHOLD = 'ENERGY_THRESHOLD',
  CARDS_IN_HAND = 'CARDS_IN_HAND',
}

export interface UserCard {
  id: string;
  userId: string;
  cardDefinitionId: string;
  level: number;
  acquiredAt: Date;
  isGolden: boolean;
  isAnimated: boolean;
}

// ============================================================================
// DECK TYPES
// ============================================================================

export interface Deck {
  id: string;
  userId: string;
  name: string;
  cards: DeckCard[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface DeckCard {
  cardDefinitionId: string;
  count: number;
}

export interface DeckValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// MATCH TYPES
// ============================================================================

export interface Match {
  id: string;
  mode: GameMode;
  status: MatchStatus;
  players: MatchPlayer[];
  winnerId?: string;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
}

export interface MatchPlayer {
  userId: string;
  deckId: string;
  result?: MatchResult;
  rewardsEarned?: MatchRewards;
}

export interface MatchRewards {
  credits: number;
  xp: number;
  cards?: string[];
  dust?: number;
}

export interface GameState {
  matchId: string;
  currentTurn: number;
  activePlayerId: string;
  players: PlayerState[];
  phase: GamePhase;
}

export enum GamePhase {
  MULLIGAN = 'MULLIGAN',
  DRAW = 'DRAW',
  MAIN = 'MAIN',
  COMBAT = 'COMBAT',
  END = 'END',
}

export interface PlayerState {
  userId: string;
  nexusHp: number;
  energy: number;
  maxEnergy: number;
  hand: CardInstance[];
  board: CardInstance[];
  deck: string[];
  graveyard: string[];
  effects: ActiveEffect[];
}

export interface CardInstance {
  instanceId: string;
  cardDefinitionId: string;
  attack: number;
  defense: number;
  currentHp: number;
  keywords: CardKeyword[];
  effects: ActiveEffect[];
  canAttack: boolean;
  attacksThisTurn: number;
}

export interface ActiveEffect {
  id: string;
  type: EffectType;
  value: number;
  duration: number;
  source: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: MatchEventType;
  playerId: string;
  timestamp: Date;
  data: Record<string, any>;
}

export enum GameActionType {
  MULLIGAN = 'MULLIGAN',
  PLAY_CARD = 'PLAY_CARD',
  ATTACK = 'ATTACK',
  USE_ABILITY = 'USE_ABILITY',
  END_TURN = 'END_TURN',
  SURRENDER = 'SURRENDER',
}

export type GameAction =
  | {
      type: GameActionType.MULLIGAN;
      playerId: string;
      data: { cardInstanceIds: string[] };
    }
  | {
      type: GameActionType.PLAY_CARD;
      playerId: string;
      data: { cardInstanceId: string; targetId?: string; position?: number };
    }
  | {
      type: GameActionType.ATTACK;
      playerId: string;
      data: { attackerId: string; targetId: string };
    }
  | {
      type: GameActionType.USE_ABILITY;
      playerId: string;
      data: { abilityId: string; targetId?: string };
    }
  | {
      type: GameActionType.END_TURN;
      playerId: string;
      data: Record<string, never>;
    }
  | {
      type: GameActionType.SURRENDER;
      playerId: string;
      data: Record<string, never>;
    };

// ============================================================================
// USER & PROFILE TYPES
// ============================================================================

export interface User {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Profile {
  userId: string;
  level: number;
  xp: number;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  winStreak: number;
  bestWinStreak: number;
  rankTier: RankTier;
  rankDivision: number;
  rankPoints: number;
  equippedCosmetics: EquippedCosmetics;
}

export interface EquippedCosmetics {
  avatar?: string;
  frame?: string;
  title?: string;
  cardBack?: string;
  emotes: string[];
  victoryAnimation?: string;
  nexusSkin?: string;
}

// ============================================================================
// ECONOMY TYPES
// ============================================================================

export interface Currency {
  userId: string;
  type: CurrencyType;
  amount: number;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: string;
  currencyType: CurrencyType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// ============================================================================
// QUEST TYPES
// ============================================================================

export interface Quest {
  id: string;
  type: string;
  name: string;
  description: string;
  requirement: QuestRequirement;
  rewards: QuestRewards;
  expiresAt?: Date;
}

export interface QuestRequirement {
  type: string;
  target: number;
  metadata?: Record<string, any>;
}

export interface QuestRewards {
  credits?: number;
  shards?: number;
  xp?: number;
  cards?: string[];
  dust?: number;
  cosmetics?: string[];
}

export interface UserQuest {
  id: string;
  userId: string;
  questId: string;
  progress: number;
  status: string;
  startedAt: Date;
  completedAt?: Date;
  claimedAt?: Date;
}

// ============================================================================
// SHOP TYPES
// ============================================================================

export interface ShopOffer {
  id: string;
  name: string;
  description: string;
  type: string;
  price: ShopPrice;
  contents: ShopContents;
  availableFrom?: Date;
  availableUntil?: Date;
  purchaseLimit?: number;
  isActive: boolean;
}

export interface ShopPrice {
  currencyType: CurrencyType;
  amount: number;
}

export interface ShopContents {
  cards?: string[];
  packs?: PackContents[];
  currency?: { type: CurrencyType; amount: number }[];
  cosmetics?: string[];
}

export interface PackContents {
  type: string;
  count: number;
  guaranteedRarity?: CardRarity;
}

// ============================================================================
// LEADERBOARD TYPES
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  tier: RankTier;
  division: number;
}

// ============================================================================
// SOCIAL TYPES
// ============================================================================

export interface Friend {
  userId: string;
  friendId: string;
  status: FriendStatus;
  createdAt: Date;
}

export enum FriendStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED',
}

// ============================================================================
// POKER TYPES
// ============================================================================

export interface PokerTable {
  id: string;
  name: string;
  maxPlayers: number;
  smallBlind: number;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  players: PokerPlayer[];
  state: PokerTableState;
}

export interface PokerPlayer {
  userId: string;
  seatIndex: number;
  chips: number;
  cards: string[];
  status: PokerPlayerStatus;
  currentBet: number;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
}

export enum PokerPlayerStatus {
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  FOLDED = 'FOLDED',
  ALL_IN = 'ALL_IN',
  SIT_OUT = 'SIT_OUT',
}

export interface PokerTableState {
  phase: PokerPhase;
  pot: number;
  communityCards: string[];
  currentBet: number;
  activePlayerIndex: number;
}

export enum PokerPhase {
  WAITING = 'WAITING',
  PRE_FLOP = 'PRE_FLOP',
  FLOP = 'FLOP',
  TURN = 'TURN',
  RIVER = 'RIVER',
  SHOWDOWN = 'SHOWDOWN',
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: Record<string, any>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
