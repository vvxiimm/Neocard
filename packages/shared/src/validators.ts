import { z } from 'zod';
import { CardRarity, CardType, Faction, GameMode, CurrencyType } from './enums';
import { GAME_CONSTANTS, VALIDATION_RULES } from './constants';

// ============================================================================
// AUTH VALIDATORS
// ============================================================================

export const TelegramInitDataSchema = z.object({
  query_id: z.string().optional(),
  user: z.string(),
  auth_date: z.string(),
  hash: z.string(),
});

export const LoginRequestSchema = z.object({
  initData: z.string(),
});

// ============================================================================
// DECK VALIDATORS
// ============================================================================

export const DeckCardSchema = z.object({
  cardDefinitionId: z.string().uuid(),
  count: z.number().int().min(1).max(GAME_CONSTANTS.MAX_CARD_COPIES),
});

export const CreateDeckSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.DECK_NAME_MIN_LENGTH)
    .max(VALIDATION_RULES.DECK_NAME_MAX_LENGTH),
  cards: z.array(DeckCardSchema).min(1),
});

export const UpdateDeckSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.DECK_NAME_MIN_LENGTH)
    .max(VALIDATION_RULES.DECK_NAME_MAX_LENGTH)
    .optional(),
  cards: z.array(DeckCardSchema).min(1).optional(),
  isActive: z.boolean().optional(),
});

// ============================================================================
// MATCH VALIDATORS
// ============================================================================

export const JoinMatchmakingSchema = z.object({
  mode: z.nativeEnum(GameMode),
  deckId: z.string().uuid(),
});

export const PlayCardActionSchema = z.object({
  cardInstanceId: z.string(),
  targetId: z.string().optional(),
  position: z.number().int().min(0).max(6).optional(),
});

export const AttackActionSchema = z.object({
  attackerId: z.string(),
  targetId: z.string(),
});

export const GameActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('MULLIGAN'),
    cardInstanceIds: z.array(z.string()),
  }),
  z.object({
    type: z.literal('PLAY_CARD'),
    data: PlayCardActionSchema,
  }),
  z.object({
    type: z.literal('ATTACK'),
    data: AttackActionSchema,
  }),
  z.object({
    type: z.literal('END_TURN'),
  }),
  z.object({
    type: z.literal('SURRENDER'),
  }),
]);

// ============================================================================
// SHOP VALIDATORS
// ============================================================================

export const PurchaseOfferSchema = z.object({
  offerId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10).default(1),
});

export const OpenPackSchema = z.object({
  packType: z.string(),
});

// ============================================================================
// CARD VALIDATORS
// ============================================================================

export const CraftCardSchema = z.object({
  cardDefinitionId: z.string().uuid(),
});

export const DisenchantCardSchema = z.object({
  userCardId: z.string().uuid(),
});

// ============================================================================
// QUEST VALIDATORS
// ============================================================================

export const ClaimQuestSchema = z.object({
  questId: z.string().uuid(),
});

export const RerollQuestSchema = z.object({
  questId: z.string().uuid(),
});

// ============================================================================
// SOCIAL VALIDATORS
// ============================================================================

export const AddFriendSchema = z.object({
  friendTelegramId: z.number().int().positive(),
});

export const RemoveFriendSchema = z.object({
  friendId: z.string().uuid(),
});

// ============================================================================
// POKER VALIDATORS
// ============================================================================

export const JoinPokerTableSchema = z.object({
  tableId: z.string().uuid(),
  buyIn: z.number().int().positive(),
});

export const PokerActionSchema = z.object({
  action: z.enum(['FOLD', 'CHECK', 'CALL', 'RAISE', 'ALL_IN']),
  amount: z.number().int().nonnegative().optional(),
});

export const ExchangeChipsSchema = z.object({
  direction: z.enum(['CHIPS_TO_CREDITS', 'CREDITS_TO_CHIPS']),
  amount: z.number().int().positive(),
});

// ============================================================================
// PROFILE VALIDATORS
// ============================================================================

export const UpdateProfileSchema = z.object({
  equippedCosmetics: z
    .object({
      avatar: z.string().uuid().optional(),
      frame: z.string().uuid().optional(),
      title: z.string().uuid().optional(),
      cardBack: z.string().uuid().optional(),
      emotes: z.array(z.string().uuid()).max(6).optional(),
      victoryAnimation: z.string().uuid().optional(),
      nexusSkin: z.string().uuid().optional(),
    })
    .optional(),
});

// ============================================================================
// ADMIN VALIDATORS
// ============================================================================

export const GrantCurrencySchema = z.object({
  userId: z.string().uuid(),
  currencyType: z.nativeEnum(CurrencyType),
  amount: z.number().int(),
  reason: z.string().min(1).max(200),
});

export const BanUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(1).max(500),
  durationDays: z.number().int().positive().optional(),
});

// ============================================================================
// PAGINATION VALIDATORS
// ============================================================================

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

// ============================================================================
// QUERY VALIDATORS
// ============================================================================

export const CardFilterSchema = z.object({
  rarity: z.nativeEnum(CardRarity).optional(),
  type: z.nativeEnum(CardType).optional(),
  faction: z.nativeEnum(Faction).optional(),
  search: z.string().max(50).optional(),
  ...PaginationSchema.shape,
});

export const MatchHistoryFilterSchema = z.object({
  mode: z.nativeEnum(GameMode).optional(),
  result: z.enum(['WIN', 'LOSS', 'DRAW']).optional(),
  ...PaginationSchema.shape,
});
