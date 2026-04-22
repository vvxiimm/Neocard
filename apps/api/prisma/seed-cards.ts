import { PrismaClient } from '@prisma/client';
import { CardRarity, CardType, Faction, CardKeyword } from '@nexus/shared';

const prisma = new PrismaClient();

const cards = [
  // ============================================================================
  // TECHBORN FACTION - Technology and AI
  // ============================================================================

  // Common Units
  {
    name: 'Cyber Scout',
    description: 'Basic reconnaissance unit',
    rarity: CardRarity.COMMON,
    type: CardType.UNIT,
    faction: Faction.TECHBORN,
    cost: 1,
    attack: 1,
    defense: 2,
    keywords: [],
    abilities: [],
    artUrl: '/cards/cyber-scout.png',
    flavorText: 'Eyes everywhere, always watching.',
    tags: ['Tech', 'Scout'],
  },
  {
    name: 'Data Miner',
    description: 'Draw a card when played',
    rarity: CardRarity.COMMON,
    type: CardType.UNIT,
    faction: Faction.TECHBORN,
    cost: 2,
    attack: 1,
    defense: 2,
    keywords: [],
    abilities: [
      {
        id: 'data-miner-draw',
        name: 'Data Mining',
        description: 'Draw a card',
        trigger: 'ON_PLAY',
        effect: { type: 'DRAW_CARD', value: 1, target: 'SELF' },
      },
    ],
    artUrl: '/cards/data-miner.png',
    flavorText: 'Information is the new currency.',
    tags: ['Tech', 'Draw'],
  },
  {
    name: 'Repair Bot',
    description: 'Heal 2 HP to your Nexus',
    rarity: CardRarity.COMMON,
    type: CardType.SPELL,
    faction: Faction.TECHBORN,
    cost: 1,
    keywords: [],
    abilities: [
      {
        id: 'repair-heal',
        name: 'Repair',
        description: 'Heal 2 HP',
        trigger: 'ON_PLAY',
        effect: { type: 'HEAL', value: 2, target: 'FRIENDLY_NEXUS' },
      },
    ],
    artUrl: '/cards/repair-bot.png',
    flavorText: 'Maintenance is key to survival.',
    tags: ['Tech', 'Heal'],
  },

  // Rare Units
  {
    name: 'Combat Drone',
    description: 'Can attack immediately',
    rarity: CardRarity.RARE,
    type: CardType.UNIT,
    faction: Faction.TECHBORN,
    cost: 3,
    attack: 3,
    defense: 2,
    keywords: [CardKeyword.RUSH],
    abilities: [],
    artUrl: '/cards/combat-drone.png',
    flavorText: 'Strike fast, strike hard.',
    tags: ['Tech', 'Aggressive'],
  },
  {
    name: 'Shield Generator',
    description: 'Must be attacked first',
    rarity: CardRarity.RARE,
    type: CardType.UNIT,
    faction: Faction.TECHBORN,
    cost: 3,
    attack: 1,
    defense: 5,
    keywords: [CardKeyword.GUARD],
    abilities: [],
    artUrl: '/cards/shield-generator.png',
    flavorText: 'Protection protocols active.',
    tags: ['Tech', 'Defensive'],
  },

  // Epic Units
  {
    name: 'AI Overseer',
    description: 'Draw 2 cards when played',
    rarity: CardRarity.EPIC,
    type: CardType.UNIT,
    faction: Faction.TECHBORN,
    cost: 5,
    attack: 3,
    defense: 4,
    keywords: [],
    abilities: [
      {
        id: 'overseer-draw',
        name: 'Data Analysis',
        description: 'Draw 2 cards',
        trigger: 'ON_PLAY',
        effect: { type: 'DRAW_CARD', value: 2, target: 'SELF' },
      },
    ],
    artUrl: '/cards/ai-overseer.png',
    flavorText: 'Knowledge is power, and I have it all.',
    tags: ['Tech', 'Draw'],
  },

  // Legendary
  {
    name: 'Quantum Core',
    description: 'All your Tech units gain +2/+2',
    rarity: CardRarity.LEGENDARY,
    type: CardType.ARTIFACT,
    faction: Faction.TECHBORN,
    cost: 6,
    keywords: [],
    abilities: [
      {
        id: 'quantum-buff',
        name: 'Quantum Enhancement',
        description: 'All friendly Tech units get +2/+2',
        trigger: 'PASSIVE',
        effect: { type: 'BUFF_ATTACK', value: 2, target: 'ALL_FRIENDLY_UNITS' },
      },
    ],
    artUrl: '/cards/quantum-core.png',
    flavorText: 'The heart of the machine.',
    tags: ['Tech', 'Buff'],
  },

  // ============================================================================
  // VOIDWALKER FACTION - Shadow and Destruction
  // ============================================================================

  // Common
  {
    name: 'Shadow Imp',
    description: 'Small but deadly',
    rarity: CardRarity.COMMON,
    type: CardType.UNIT,
    faction: Faction.VOIDWALKER,
    cost: 1,
    attack: 2,
    defense: 1,
    keywords: [],
    abilities: [],
    artUrl: '/cards/shadow-imp.png',
    flavorText: 'From darkness, we strike.',
    tags: ['Void', 'Aggressive'],
  },
  {
    name: 'Void Bolt',
    description: 'Deal 3 damage',
    rarity: CardRarity.COMMON,
    type: CardType.SPELL,
    faction: Faction.VOIDWALKER,
    cost: 2,
    keywords: [],
    abilities: [
      {
        id: 'void-bolt-dmg',
        name: 'Void Bolt',
        description: 'Deal 3 damage',
        trigger: 'ON_PLAY',
        effect: { type: 'DAMAGE', value: 3, target: 'ENEMY_UNIT' },
      },
    ],
    artUrl: '/cards/void-bolt.png',
    flavorText: 'Pure destructive energy.',
    tags: ['Void', 'Damage'],
  },

  // Rare
  {
    name: 'Void Assassin',
    description: 'Stealth and Rush',
    rarity: CardRarity.RARE,
    type: CardType.UNIT,
    faction: Faction.VOIDWALKER,
    cost: 4,
    attack: 4,
    defense: 2,
    keywords: [CardKeyword.STEALTH, CardKeyword.RUSH],
    abilities: [],
    artUrl: '/cards/void-assassin.png',
    flavorText: 'You never see it coming.',
    tags: ['Void', 'Stealth'],
  },

  // Epic
  {
    name: 'Shadow Reaper',
    description: 'Destroy a unit when played',
    rarity: CardRarity.EPIC,
    type: CardType.UNIT,
    faction: Faction.VOIDWALKER,
    cost: 6,
    attack: 5,
    defense: 4,
    keywords: [],
    abilities: [
      {
        id: 'reaper-destroy',
        name: 'Death Touch',
        description: 'Destroy target unit',
        trigger: 'ON_PLAY',
        effect: { type: 'DESTROY_UNIT', target: 'ENEMY_UNIT' },
      },
    ],
    artUrl: '/cards/shadow-reaper.png',
    flavorText: 'Death comes for all.',
    tags: ['Void', 'Removal'],
  },

  // Legendary
  {
    name: 'Void Lord',
    description: 'All enemies take 1 damage at turn end',
    rarity: CardRarity.LEGENDARY,
    type: CardType.UNIT,
    faction: Faction.VOIDWALKER,
    cost: 8,
    attack: 6,
    defense: 6,
    keywords: [],
    abilities: [
      {
        id: 'void-lord-burn',
        name: 'Void Aura',
        description: 'Deal 1 damage to all enemies at end of turn',
        trigger: 'ON_TURN_END',
        effect: { type: 'DAMAGE', value: 1, target: 'ALL_ENEMY_UNITS' },
      },
    ],
    artUrl: '/cards/void-lord.png',
    flavorText: 'Bow before the void.',
    tags: ['Void', 'Control'],
  },

  // ============================================================================
  // LUMINA FACTION - Light and Healing
  // ============================================================================

  // Common
  {
    name: 'Light Bearer',
    description: 'Basic healer',
    rarity: CardRarity.COMMON,
    type: CardType.UNIT,
    faction: Faction.LUMINA,
    cost: 2,
    attack: 1,
    defense: 3,
    keywords: [],
    abilities: [
      {
        id: 'bearer-heal',
        name: 'Healing Light',
        description: 'Heal 2 HP to your Nexus',
        trigger: 'ON_PLAY',
        effect: { type: 'HEAL', value: 2, target: 'FRIENDLY_NEXUS' },
      },
    ],
    artUrl: '/cards/light-bearer.png',
    flavorText: 'Hope shines eternal.',
    tags: ['Light', 'Heal'],
  },
  {
    name: 'Radiant Strike',
    description: 'Deal 2 damage and heal 2',
    rarity: CardRarity.COMMON,
    type: CardType.SPELL,
    faction: Faction.LUMINA,
    cost: 2,
    keywords: [],
    abilities: [
      {
        id: 'radiant-dmg',
        name: 'Radiant Strike',
        description: 'Deal 2 damage and heal 2',
        trigger: 'ON_PLAY',
        effect: { type: 'DAMAGE', value: 2, target: 'ENEMY_UNIT' },
      },
    ],
    artUrl: '/cards/radiant-strike.png',
    flavorText: 'Light purifies all.',
    tags: ['Light', 'Damage', 'Heal'],
  },

  // Rare
  {
    name: 'Guardian Angel',
    description: 'Guard and Lifesteal',
    rarity: CardRarity.RARE,
    type: CardType.UNIT,
    faction: Faction.LUMINA,
    cost: 4,
    attack: 3,
    defense: 4,
    keywords: [CardKeyword.GUARD, CardKeyword.LIFESTEAL],
    abilities: [],
    artUrl: '/cards/guardian-angel.png',
    flavorText: 'Protected by the light.',
    tags: ['Light', 'Defensive', 'Heal'],
  },

  // Epic
  {
    name: 'Divine Healer',
    description: 'Heal all friendly units for 3',
    rarity: CardRarity.EPIC,
    type: CardType.UNIT,
    faction: Faction.LUMINA,
    cost: 5,
    attack: 2,
    defense: 5,
    keywords: [],
    abilities: [
      {
        id: 'divine-heal',
        name: 'Mass Healing',
        description: 'Heal all friendly units for 3',
        trigger: 'ON_PLAY',
        effect: { type: 'HEAL', value: 3, target: 'ALL_FRIENDLY_UNITS' },
      },
    ],
    artUrl: '/cards/divine-healer.png',
    flavorText: 'Blessings upon you all.',
    tags: ['Light', 'Heal'],
  },

  // Legendary
  {
    name: 'Celestial Avatar',
    description: 'Heal 5 HP and draw 2 cards',
    rarity: CardRarity.LEGENDARY,
    type: CardType.UNIT,
    faction: Faction.LUMINA,
    cost: 7,
    attack: 5,
    defense: 7,
    keywords: [CardKeyword.LIFESTEAL],
    abilities: [
      {
        id: 'avatar-combo',
        name: 'Divine Intervention',
        description: 'Heal 5 and draw 2',
        trigger: 'ON_PLAY',
        effect: { type: 'HEAL', value: 5, target: 'FRIENDLY_NEXUS' },
      },
    ],
    artUrl: '/cards/celestial-avatar.png',
    flavorText: 'The light incarnate.',
    tags: ['Light', 'Heal', 'Draw'],
  },

  // ============================================================================
  // WILDFIRE FACTION - Chaos and Burn
  // ============================================================================

  // Common
  {
    name: 'Flame Sprite',
    description: 'Deal 1 damage when played',
    rarity: CardRarity.COMMON,
    type: CardType.UNIT,
    faction: Faction.WILDFIRE,
    cost: 1,
    attack: 1,
    defense: 1,
    keywords: [],
    abilities: [
      {
        id: 'sprite-burn',
        name: 'Spark',
        description: 'Deal 1 damage',
        trigger: 'ON_PLAY',
        effect: { type: 'DAMAGE', value: 1, target: 'ENEMY_NEXUS' },
      },
    ],
    artUrl: '/cards/flame-sprite.png',
    flavorText: 'A small spark can start an inferno.',
    tags: ['Fire', 'Burn'],
  },
  {
    name: 'Fireball',
    description: 'Deal 4 damage',
    rarity: CardRarity.COMMON,
    type: CardType.SPELL,
    faction: Faction.WILDFIRE,
    cost: 3,
    keywords: [],
    abilities: [
      {
        id: 'fireball-dmg',
        name: 'Fireball',
        description: 'Deal 4 damage',
        trigger: 'ON_PLAY',
        effect: { type: 'DAMAGE', value: 4, target: 'ENEMY_UNIT' },
      },
    ],
    artUrl: '/cards/fireball.png',
    flavorText: 'Burn it all.',
    tags: ['Fire', 'Damage'],
  },

  // Rare
  {
    name: 'Inferno Beast',
    description: 'Attacks twice',
    rarity: CardRarity.RARE,
    type: CardType.UNIT,
    faction: Faction.WILDFIRE,
    cost: 5,
    attack: 3,
    defense: 3,
    keywords: [CardKeyword.FRENZY],
    abilities: [],
    artUrl: '/cards/inferno-beast.png',
    flavorText: 'Unstoppable fury.',
    tags: ['Fire', 'Aggressive'],
  },

  // Epic
  {
    name: 'Pyroclasm',
    description: 'Deal 2 damage to all enemies',
    rarity: CardRarity.EPIC,
    type: CardType.SPELL,
    faction: Faction.WILDFIRE,
    cost: 5,
    keywords: [],
    abilities: [
      {
        id: 'pyro-aoe',
        name: 'Pyroclasm',
        description: 'Deal 2 damage to all enemies',
        trigger: 'ON_PLAY',
        effect: { type: 'DAMAGE', value: 2, target: 'ALL_ENEMY_UNITS' },
      },
    ],
    artUrl: '/cards/pyroclasm.png',
    flavorText: 'The world burns.',
    tags: ['Fire', 'AOE'],
  },

  // Legendary
  {
    name: 'Phoenix Eternal',
    description: 'Returns to hand when destroyed',
    rarity: CardRarity.LEGENDARY,
    type: CardType.UNIT,
    faction: Faction.WILDFIRE,
    cost: 6,
    attack: 5,
    defense: 5,
    keywords: [CardKeyword.ECHO],
    abilities: [
      {
        id: 'phoenix-rebirth',
        name: 'Rebirth',
        description: 'Return to hand when destroyed',
        trigger: 'ON_DEATH',
        effect: { type: 'SUMMON_TOKEN', target: 'SELF' },
      },
    ],
    artUrl: '/cards/phoenix-eternal.png',
    flavorText: 'Death is but a new beginning.',
    tags: ['Fire', 'Resilient'],
  },

  // ============================================================================
  // CHRONOS FACTION - Time Manipulation
  // ============================================================================

  // Common
  {
    name: 'Time Wisp',
    description: 'Basic time unit',
    rarity: CardRarity.COMMON,
    type: CardType.UNIT,
    faction: Faction.CHRONOS,
    cost: 2,
    attack: 2,
    defense: 2,
    keywords: [],
    abilities: [],
    artUrl: '/cards/time-wisp.png',
    flavorText: 'Time flows through all.',
    tags: ['Time'],
  },

  // Rare
  {
    name: 'Temporal Shift',
    description: 'Return a unit to hand',
    rarity: CardRarity.RARE,
    type: CardType.SPELL,
    faction: Faction.CHRONOS,
    cost: 2,
    keywords: [],
    abilities: [
      {
        id: 'shift-bounce',
        name: 'Temporal Shift',
        description: 'Return target unit to hand',
        trigger: 'ON_PLAY',
        effect: { type: 'TRANSFORM', target: 'ENEMY_UNIT' },
      },
    ],
    artUrl: '/cards/temporal-shift.png',
    flavorText: 'Rewind time itself.',
    tags: ['Time', 'Bounce'],
  },

  // Epic
  {
    name: 'Chrono Mage',
    description: 'Draw 2 cards and gain 1 energy',
    rarity: CardRarity.EPIC,
    type: CardType.UNIT,
    faction: Faction.CHRONOS,
    cost: 4,
    attack: 2,
    defense: 4,
    keywords: [],
    abilities: [
      {
        id: 'chrono-accel',
        name: 'Time Acceleration',
        description: 'Draw 2 cards',
        trigger: 'ON_PLAY',
        effect: { type: 'DRAW_CARD', value: 2, target: 'SELF' },
      },
    ],
    artUrl: '/cards/chrono-mage.png',
    flavorText: 'Master of moments.',
    tags: ['Time', 'Draw'],
  },

  // Legendary
  {
    name: 'Time Warden',
    description: 'Take an extra turn (once per game)',
    rarity: CardRarity.LEGENDARY,
    type: CardType.UNIT,
    faction: Faction.CHRONOS,
    cost: 9,
    attack: 5,
    defense: 7,
    keywords: [],
    abilities: [
      {
        id: 'warden-extra-turn',
        name: 'Extra Turn',
        description: 'Take an extra turn',
        trigger: 'ON_TURN_END',
        effect: { type: 'SUMMON_TOKEN', target: 'SELF' },
      },
    ],
    artUrl: '/cards/time-warden.png',
    flavorText: 'Time bends to my will.',
    tags: ['Time', 'Control'],
  },

  // ============================================================================
  // NEXUS FACTION - Reality Warpers (Neutral)
  // ============================================================================

  // Common
  {
    name: 'Reality Glitch',
    description: 'Transform into random unit',
    rarity: CardRarity.COMMON,
    type: CardType.UNIT,
    faction: Faction.NEXUS,
    cost: 2,
    attack: 2,
    defense: 2,
    keywords: [],
    abilities: [],
    artUrl: '/cards/reality-glitch.png',
    flavorText: 'Nothing is certain.',
    tags: ['Nexus', 'Random'],
  },

  // Rare
  {
    name: 'Dimensional Rift',
    description: 'Summon a random unit',
    rarity: CardRarity.RARE,
    type: CardType.SPELL,
    faction: Faction.NEXUS,
    cost: 3,
    keywords: [],
    abilities: [
      {
        id: 'rift-summon',
        name: 'Rift',
        description: 'Summon random unit',
        trigger: 'ON_PLAY',
        effect: { type: 'SUMMON_TOKEN', target: 'SELF' },
      },
    ],
    artUrl: '/cards/dimensional-rift.png',
    flavorText: 'Breach reality itself.',
    tags: ['Nexus', 'Summon'],
  },

  // Epic
  {
    name: 'Nexus Guardian',
    description: 'Adapts to situation',
    rarity: CardRarity.EPIC,
    type: CardType.UNIT,
    faction: Faction.NEXUS,
    cost: 5,
    attack: 4,
    defense: 4,
    keywords: [CardKeyword.BARRIER],
    abilities: [],
    artUrl: '/cards/nexus-guardian.png',
    flavorText: 'Protector of realities.',
    tags: ['Nexus', 'Defensive'],
  },

  // Mythic
  {
    name: 'Reality Fracture',
    description: 'Destroy all units, draw cards equal to units destroyed',
    rarity: CardRarity.MYTHIC,
    type: CardType.SPELL,
    faction: Faction.NEXUS,
    cost: 10,
    keywords: [],
    abilities: [
      {
        id: 'fracture-wipe',
        name: 'Reality Fracture',
        description: 'Destroy all units',
        trigger: 'ON_PLAY',
        effect: { type: 'DESTROY_UNIT', target: 'ALL_UNITS' },
      },
    ],
    artUrl: '/cards/reality-fracture.png',
    flavorText: 'When reality breaks, chaos reigns.',
    tags: ['Nexus', 'Wipe'],
  },

  // ============================================================================
  // NEUTRAL CARDS - Usable by all
  // ============================================================================

  {
    name: 'Mercenary',
    description: 'Reliable fighter',
    rarity: CardRarity.COMMON,
    type: CardType.UNIT,
    faction: Faction.NEXUS,
    cost: 3,
    attack: 3,
    defense: 3,
    keywords: [],
    abilities: [],
    artUrl: '/cards/mercenary.png',
    flavorText: 'Gold talks.',
    tags: ['Neutral'],
  },
  {
    name: 'Meditation',
    description: 'Draw 2 cards',
    rarity: CardRarity.COMMON,
    type: CardType.SPELL,
    faction: Faction.NEXUS,
    cost: 2,
    keywords: [],
    abilities: [
      {
        id: 'med-draw',
        name: 'Meditation',
        description: 'Draw 2 cards',
        trigger: 'ON_PLAY',
        effect: { type: 'DRAW_CARD', value: 2, target: 'SELF' },
      },
    ],
    artUrl: '/cards/meditation.png',
    flavorText: 'Clear your mind.',
    tags: ['Neutral', 'Draw'],
  },
  {
    name: 'Energy Surge',
    description: 'Gain 2 energy this turn',
    rarity: CardRarity.RARE,
    type: CardType.SPELL,
    faction: Faction.NEXUS,
    cost: 1,
    keywords: [],
    abilities: [
      {
        id: 'surge-energy',
        name: 'Energy Surge',
        description: 'Gain 2 energy',
        trigger: 'ON_PLAY',
        effect: { type: 'BUFF_ATTACK', value: 2, target: 'SELF' },
      },
    ],
    artUrl: '/cards/energy-surge.png',
    flavorText: 'Power overwhelming.',
    tags: ['Neutral', 'Ramp'],
  },
];

async function main() {
  console.log('🌱 Seeding card definitions...');

  for (const card of cards) {
    await prisma.cardDefinition.create({
      data: {
        ...card,
        abilities: JSON.stringify(card.abilities),
      },
    });
  }

  console.log(`✅ Created ${cards.length} cards`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
