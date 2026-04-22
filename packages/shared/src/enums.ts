// Card Rarities
export enum CardRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
  MYTHIC = 'MYTHIC',
}

// Card Types
export enum CardType {
  UNIT = 'UNIT',
  SPELL = 'SPELL',
  ARTIFACT = 'ARTIFACT',
  REACTION = 'REACTION',
}

// Factions
export enum Faction {
  TECHBORN = 'TECHBORN',
  VOIDWALKER = 'VOIDWALKER',
  LUMINA = 'LUMINA',
  WILDFIRE = 'WILDFIRE',
  CHRONOS = 'CHRONOS',
  NEXUS = 'NEXUS',
}

// Card Keywords
export enum CardKeyword {
  RUSH = 'RUSH',
  GUARD = 'GUARD',
  STEALTH = 'STEALTH',
  LIFESTEAL = 'LIFESTEAL',
  OVERWHELM = 'OVERWHELM',
  ECHO = 'ECHO',
  EVOLVE = 'EVOLVE',
  COMBO = 'COMBO',
  FRENZY = 'FRENZY',
  REGENERATE = 'REGENERATE',
  BARRIER = 'BARRIER',
}

// Game Modes
export enum GameMode {
  CLASSIC = 'CLASSIC',
  POKER = 'POKER',
  FAST = 'FAST',
  RANKED = 'RANKED',
  PVE = 'PVE',
  DRAFT = 'DRAFT',
  EVENT = 'EVENT',
}

// Match Status
export enum MatchStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

// Match Result
export enum MatchResult {
  WIN = 'WIN',
  LOSS = 'LOSS',
  DRAW = 'DRAW',
}

// Currency Types
export enum CurrencyType {
  CREDITS = 'CREDITS',
  SHARDS = 'SHARDS',
  CHIPS = 'CHIPS',
  DUST = 'DUST',
}

// Transaction Types
export enum TransactionType {
  MATCH_REWARD = 'MATCH_REWARD',
  QUEST_REWARD = 'QUEST_REWARD',
  PURCHASE = 'PURCHASE',
  PACK_OPEN = 'PACK_OPEN',
  CARD_CRAFT = 'CARD_CRAFT',
  CARD_DISENCHANT = 'CARD_DISENCHANT',
  BATTLE_PASS = 'BATTLE_PASS',
  DAILY_LOGIN = 'DAILY_LOGIN',
  ACHIEVEMENT = 'ACHIEVEMENT',
  ADMIN_GRANT = 'ADMIN_GRANT',
}

// Quest Types
export enum QuestType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  ACHIEVEMENT = 'ACHIEVEMENT',
}

// Quest Status
export enum QuestStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CLAIMED = 'CLAIMED',
}

// Rank Tiers
export enum RankTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER',
}

// Match Event Types
export enum MatchEventType {
  GAME_START = 'GAME_START',
  TURN_START = 'TURN_START',
  TURN_END = 'TURN_END',
  CARD_DRAWN = 'CARD_DRAWN',
  CARD_PLAYED = 'CARD_PLAYED',
  CARD_DISCARDED = 'CARD_DISCARDED',
  UNIT_ATTACK = 'UNIT_ATTACK',
  DAMAGE_DEALT = 'DAMAGE_DEALT',
  UNIT_DESTROYED = 'UNIT_DESTROYED',
  EFFECT_TRIGGERED = 'EFFECT_TRIGGERED',
  GAME_END = 'GAME_END',
}

// Poker Actions
export enum PokerAction {
  FOLD = 'FOLD',
  CHECK = 'CHECK',
  CALL = 'CALL',
  RAISE = 'RAISE',
  ALL_IN = 'ALL_IN',
}

// Poker Hand Ranks
export enum PokerHandRank {
  HIGH_CARD = 'HIGH_CARD',
  PAIR = 'PAIR',
  TWO_PAIR = 'TWO_PAIR',
  THREE_OF_KIND = 'THREE_OF_KIND',
  STRAIGHT = 'STRAIGHT',
  FLUSH = 'FLUSH',
  FULL_HOUSE = 'FULL_HOUSE',
  FOUR_OF_KIND = 'FOUR_OF_KIND',
  STRAIGHT_FLUSH = 'STRAIGHT_FLUSH',
  ROYAL_FLUSH = 'ROYAL_FLUSH',
}

// Shop Offer Types
export enum ShopOfferType {
  CARD_PACK = 'CARD_PACK',
  COSMETIC = 'COSMETIC',
  CURRENCY = 'CURRENCY',
  BUNDLE = 'BUNDLE',
}

// Cosmetic Types
export enum CosmeticType {
  AVATAR = 'AVATAR',
  FRAME = 'FRAME',
  TITLE = 'TITLE',
  CARD_BACK = 'CARD_BACK',
  EMOTE = 'EMOTE',
  VICTORY_ANIMATION = 'VICTORY_ANIMATION',
  NEXUS_SKIN = 'NEXUS_SKIN',
}
