import { CardRarity, CurrencyType, RankTier } from './enums';

// ============================================================================
// GAME CONSTANTS
// ============================================================================

export const GAME_CONSTANTS = {
  // Deck Rules
  DECK_SIZE: 30,
  DECK_SIZE_FAST: 20,
  MAX_CARD_COPIES: 2,
  MAX_LEGENDARY_COPIES: 1,

  // Match Rules
  STARTING_NEXUS_HP: 20,
  STARTING_NEXUS_HP_FAST: 15,
  STARTING_HAND_SIZE: 5,
  STARTING_ENERGY: 1,
  STARTING_ENERGY_FAST: 3,
  MAX_ENERGY: 10,
  ENERGY_PER_TURN: 1,
  ENERGY_PER_TURN_FAST: 2,
  MAX_BOARD_SIZE: 7,
  MAX_HAND_SIZE: 10,

  // Mulligan
  MULLIGAN_TIME_SECONDS: 30,
  MAX_MULLIGAN_CARDS: 5,

  // Turn Timer
  TURN_TIME_SECONDS: 90,
  TURN_TIME_FAST_SECONDS: 45,

  // XP & Leveling
  BASE_XP_PER_LEVEL: 1000,
  XP_SCALING_FACTOR: 1.1,
  MAX_LEVEL: 100,

  // Match Rewards
  BASE_CREDITS_WIN: 50,
  BASE_CREDITS_LOSS: 20,
  BASE_XP_WIN: 100,
  BASE_XP_LOSS: 50,
  WIN_STREAK_BONUS_CREDITS: 10,
  WIN_STREAK_BONUS_XP: 20,

  // Ranked
  RANK_POINTS_WIN: 25,
  RANK_POINTS_LOSS: 15,
  RANK_POINTS_PER_DIVISION: 100,
  DIVISIONS_PER_TIER: 5,
  WIN_STREAK_BONUS_POINTS: 5,

  // Economy
  PACK_PRICE_STANDARD: 100,
  PACK_PRICE_PREMIUM: 200,
  PACK_SIZE: 5,
  DUST_CRAFT_COST: {
    [CardRarity.COMMON]: 40,
    [CardRarity.RARE]: 100,
    [CardRarity.EPIC]: 400,
    [CardRarity.LEGENDARY]: 1600,
    [CardRarity.MYTHIC]: 3200,
  },
  DUST_DISENCHANT_VALUE: {
    [CardRarity.COMMON]: 5,
    [CardRarity.RARE]: 20,
    [CardRarity.EPIC]: 100,
    [CardRarity.LEGENDARY]: 400,
    [CardRarity.MYTHIC]: 800,
  },

  // Card Drop Rates (Standard Pack)
  DROP_RATES: {
    [CardRarity.COMMON]: 0.6,
    [CardRarity.RARE]: 0.25,
    [CardRarity.EPIC]: 0.1,
    [CardRarity.LEGENDARY]: 0.04,
    [CardRarity.MYTHIC]: 0.01,
  },

  // Pity System
  PITY_EPIC_PACKS: 10,
  PITY_LEGENDARY_PACKS: 40,

  // Poker
  POKER_STARTING_CHIPS: 1000,
  POKER_DAILY_BONUS_CHIPS: 500,
  POKER_CHIPS_TO_CREDITS_RATE: 10, // 10 chips = 1 credit
  POKER_CREDITS_TO_CHIPS_RATE: 10, // 1 credit = 10 chips
  POKER_EXCHANGE_DAILY_LIMIT: 10000, // Max 10k chips per day

  // Social
  MAX_FRIENDS: 100,
  MAX_EMOTE_SLOTS: 6,

  // Battle Pass
  BATTLE_PASS_TIERS: 50,
  BATTLE_PASS_XP_PER_TIER: 1000,
  BATTLE_PASS_DURATION_DAYS: 60,

  // Daily Login
  DAILY_LOGIN_STREAK_MAX: 7,

  // Quests
  MAX_DAILY_QUESTS: 3,
  MAX_WEEKLY_QUESTS: 3,
  QUEST_REROLL_COST: 50,

  // Draft
  DRAFT_PICKS: 30,
  DRAFT_OPTIONS_PER_PICK: 3,
  DRAFT_MAX_WINS: 12,
  DRAFT_MAX_LOSSES: 3,
  DRAFT_ENTRY_COST: 150,

  // Rate Limiting
  MAX_MATCHES_PER_HOUR: 30,
  MAX_SHOP_PURCHASES_PER_DAY: 50,
  MAX_FRIEND_REQUESTS_PER_DAY: 20,

  // Timeouts
  MATCHMAKING_TIMEOUT_SECONDS: 60,
  MATCH_INACTIVITY_TIMEOUT_SECONDS: 180,
  WEBSOCKET_PING_INTERVAL_MS: 30000,
  WEBSOCKET_TIMEOUT_MS: 60000,
} as const;

// ============================================================================
// RANK SYSTEM
// ============================================================================

export const RANK_SYSTEM = {
  [RankTier.BRONZE]: { divisions: 5, pointsPerDivision: 100, minMMR: 0 },
  [RankTier.SILVER]: { divisions: 5, pointsPerDivision: 100, minMMR: 500 },
  [RankTier.GOLD]: { divisions: 5, pointsPerDivision: 100, minMMR: 1000 },
  [RankTier.PLATINUM]: { divisions: 5, pointsPerDivision: 100, minMMR: 1500 },
  [RankTier.DIAMOND]: { divisions: 5, pointsPerDivision: 100, minMMR: 2000 },
  [RankTier.MASTER]: { divisions: 1, pointsPerDivision: 0, minMMR: 2500 },
  [RankTier.GRANDMASTER]: { divisions: 1, pointsPerDivision: 0, minMMR: 3000 },
} as const;

// ============================================================================
// CURRENCY DISPLAY
// ============================================================================

export const CURRENCY_CONFIG = {
  [CurrencyType.CREDITS]: {
    name: 'Credits',
    symbol: '₵',
    color: '#00F0FF',
    icon: 'coins',
  },
  [CurrencyType.SHARDS]: {
    name: 'Nexus Shards',
    symbol: '◆',
    color: '#B026FF',
    icon: 'gem',
  },
  [CurrencyType.CHIPS]: {
    name: 'Poker Chips',
    symbol: '⬢',
    color: '#FFD700',
    icon: 'poker-chip',
  },
  [CurrencyType.DUST]: {
    name: 'Crafting Dust',
    symbol: '✦',
    color: '#9E9E9E',
    icon: 'sparkles',
  },
} as const;

// ============================================================================
// RARITY CONFIG
// ============================================================================

export const RARITY_CONFIG = {
  [CardRarity.COMMON]: {
    name: 'Common',
    color: '#9E9E9E',
    glow: 'rgba(158, 158, 158, 0.3)',
    gradient: 'linear-gradient(135deg, #757575 0%, #9E9E9E 100%)',
  },
  [CardRarity.RARE]: {
    name: 'Rare',
    color: '#2196F3',
    glow: 'rgba(33, 150, 243, 0.5)',
    gradient: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
  },
  [CardRarity.EPIC]: {
    name: 'Epic',
    color: '#9C27B0',
    glow: 'rgba(156, 39, 176, 0.6)',
    gradient: 'linear-gradient(135deg, #7B1FA2 0%, #9C27B0 100%)',
  },
  [CardRarity.LEGENDARY]: {
    name: 'Legendary',
    color: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.7)',
    gradient: 'linear-gradient(135deg, #FFA000 0%, #FFD700 100%)',
  },
  [CardRarity.MYTHIC]: {
    name: 'Mythic',
    color: '#FF00FF',
    glow: 'rgba(255, 0, 255, 0.8)',
    gradient: 'linear-gradient(135deg, #FF00FF 0%, #00F0FF 50%, #FFD700 100%)',
  },
} as const;

// ============================================================================
// WEBSOCKET EVENTS
// ============================================================================

export const WS_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  PING: 'ping',
  PONG: 'pong',

  // Auth
  AUTH: 'auth',
  AUTH_SUCCESS: 'auth:success',
  AUTH_ERROR: 'auth:error',

  // Matchmaking
  MATCH_QUEUE_JOIN: 'match:queue:join',
  MATCH_QUEUE_LEAVE: 'match:queue:leave',
  MATCH_FOUND: 'match:found',
  MATCH_READY: 'match:ready',
  MATCH_START: 'match:start',
  MATCH_CANCELLED: 'match:cancelled',

  // Match
  MATCH_STATE: 'match:state',
  MATCH_ACTION: 'match:action',
  MATCH_EVENT: 'match:event',
  MATCH_END: 'match:end',
  MATCH_SURRENDER: 'match:surrender',
  MATCH_RECONNECT: 'match:reconnect',

  // Poker
  POKER_JOIN_TABLE: 'poker:join',
  POKER_LEAVE_TABLE: 'poker:leave',
  POKER_TABLE_STATE: 'poker:state',
  POKER_ACTION: 'poker:action',
  POKER_HAND_END: 'poker:hand_end',

  // Notifications
  NOTIFICATION: 'notification',
  FRIEND_REQUEST: 'friend:request',
  FRIEND_ACCEPTED: 'friend:accepted',
  QUEST_COMPLETED: 'quest:completed',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  // Auth
  AUTH_TELEGRAM: '/auth/telegram',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',

  // Profile
  PROFILE_GET: '/profile',
  PROFILE_UPDATE: '/profile',

  // Cards
  CARDS_DEFINITIONS: '/cards/definitions',
  CARDS_COLLECTION: '/cards/collection',
  CARDS_CRAFT: '/cards/craft',
  CARDS_DISENCHANT: '/cards/disenchant',

  // Decks
  DECKS_LIST: '/decks',
  DECKS_CREATE: '/decks',
  DECKS_UPDATE: '/decks/:id',
  DECKS_DELETE: '/decks/:id',
  DECKS_VALIDATE: '/decks/:id/validate',

  // Matches
  MATCHES_HISTORY: '/matches/history',
  MATCHES_STATS: '/matches/stats',

  // Shop
  SHOP_OFFERS: '/shop/offers',
  SHOP_PURCHASE: '/shop/purchase',
  SHOP_OPEN_PACK: '/shop/open-pack',

  // Quests
  QUESTS_ACTIVE: '/quests/active',
  QUESTS_CLAIM: '/quests/:id/claim',
  QUESTS_REROLL: '/quests/:id/reroll',

  // Battle Pass
  BATTLE_PASS_STATUS: '/battle-pass',
  BATTLE_PASS_CLAIM: '/battle-pass/claim/:tier',

  // Leaderboard
  LEADERBOARD_GLOBAL: '/leaderboard/global',
  LEADERBOARD_FRIENDS: '/leaderboard/friends',

  // Social
  FRIENDS_LIST: '/friends',
  FRIENDS_ADD: '/friends/add',
  FRIENDS_REMOVE: '/friends/:id',
  FRIENDS_ACCEPT: '/friends/:id/accept',
  FRIENDS_REJECT: '/friends/:id/reject',

  // Poker
  POKER_TABLES: '/poker/tables',
  POKER_HISTORY: '/poker/history',
  POKER_EXCHANGE: '/poker/exchange',

  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_GRANT_CURRENCY: '/admin/grant-currency',
  ADMIN_BAN_USER: '/admin/ban-user',
} as const;

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  // Auth
  INVALID_TELEGRAM_DATA: 'INVALID_TELEGRAM_DATA',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Validation
  INVALID_INPUT: 'INVALID_INPUT',
  DECK_INVALID: 'DECK_INVALID',
  DECK_TOO_SMALL: 'DECK_TOO_SMALL',
  DECK_TOO_LARGE: 'DECK_TOO_LARGE',
  TOO_MANY_COPIES: 'TOO_MANY_COPIES',

  // Economy
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  ITEM_NOT_FOUND: 'ITEM_NOT_FOUND',
  PURCHASE_LIMIT_REACHED: 'PURCHASE_LIMIT_REACHED',
  ALREADY_OWNED: 'ALREADY_OWNED',

  // Match
  MATCH_NOT_FOUND: 'MATCH_NOT_FOUND',
  INVALID_ACTION: 'INVALID_ACTION',
  NOT_YOUR_TURN: 'NOT_YOUR_TURN',
  CARD_NOT_IN_HAND: 'CARD_NOT_IN_HAND',
  INSUFFICIENT_ENERGY: 'INSUFFICIENT_ENERGY',
  INVALID_TARGET: 'INVALID_TARGET',
  BOARD_FULL: 'BOARD_FULL',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

  // General
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  DECK_NAME_MIN_LENGTH: 1,
  DECK_NAME_MAX_LENGTH: 30,
  CHAT_MESSAGE_MAX_LENGTH: 200,
} as const;
