# Nexus Cards - Game Design Document

## 🌌 Universe & Lore

**Setting:** In the year 2157, humanity discovered the Nexus—a digital dimension where consciousness and code merge. Cards are not mere game pieces but living digital entities from parallel realities, each with unique powers and personalities.

**Factions:**
- **Techborn:** Cybernetic warriors and AI constructs
- **Voidwalkers:** Shadow manipulators from dark dimensions
- **Lumina:** Light-based celestial beings
- **Wildfire:** Chaotic elemental forces
- **Chronos:** Time-bending entities
- **Nexus:** Neutral reality-warpers

## 🎮 Core Game Modes

### 1. Classic Battle Mode
**Description:** Strategic 1v1 card battles  
**Duration:** 5-10 minutes  
**Objective:** Reduce opponent's Nexus HP to 0

**Rules:**
- Each player has 20 Nexus HP
- Deck size: 30 cards
- Starting hand: 5 cards (mulligan available)
- Energy: Start at 1, gain +1 per turn (max 10)
- Turn structure:
  1. Draw phase (draw 1 card)
  2. Energy phase (gain 1 energy)
  3. Main phase (play cards, attack)
  4. End phase (trigger end-of-turn effects)

**Card Types:**
- **Units (Creatures):** Can attack and defend
  - Attack: Damage dealt
  - Defense: HP
  - Abilities: Special effects
- **Spells:** One-time effects
- **Artifacts:** Persistent field effects
- **Reactions:** Triggered abilities

**Combat:**
- Units can attack enemy Nexus or enemy units
- Defender chooses blockers
- Damage is simultaneous
- Destroyed units go to graveyard

### 2. Poker Mode
**Description:** Texas Hold'em poker with virtual chips  
**Duration:** Variable (hand-by-hand)  
**Objective:** Win chips through poker gameplay

**Features:**
- Cash tables (different stakes)
- Sit & Go tournaments
- Daily freerolls
- Chip exchange with soft currency
- Poker-specific achievements
- Hand history and statistics

**Integration:**
- Earn poker chips through daily quests
- Convert soft currency ↔ chips (rate-limited)
- Unlock special card backs through poker achievements
- Poker leaderboards separate from main game

### 3. Fast Mode
**Description:** Quick 3-minute battles  
**Duration:** 3 minutes max  
**Objective:** Deal most damage or destroy Nexus

**Modified Rules:**
- 15 Nexus HP (instead of 20)
- Start with 3 energy (instead of 1)
- Gain 2 energy per turn
- Smaller deck (20 cards)
- Faster animations
- Perfect for mobile sessions

### 4. Ranked Mode
**Description:** Competitive ladder with seasons  
**Duration:** Standard battle length  
**Objective:** Climb ranks and earn seasonal rewards

**Ranking System:**
- **Tiers:** Bronze → Silver → Gold → Platinum → Diamond → Master → Grandmaster
- **Divisions:** 5 divisions per tier (V to I)
- **MMR:** Hidden matchmaking rating
- **Seasons:** 2 months each
- **Rewards:** Exclusive cards, cosmetics, currency

**Rank Progression:**
- Win: +20-30 points
- Loss: -15-20 points
- Win streak bonus: +5 per consecutive win
- Rank protection at division V

### 5. PvE / Story Mode
**Description:** Campaign against AI opponents  
**Duration:** Variable  
**Objective:** Complete chapters and defeat bosses

**Structure:**
- 5 chapters, 10 missions each
- Progressive difficulty
- Boss battles with unique mechanics
- Story cutscenes
- Unlock cards through progression

**AI Difficulty Levels:**
- Easy: Basic AI, good for learning
- Normal: Competent AI with strategy
- Hard: Advanced AI with optimal plays
- Boss: Unique mechanics and cheating AI (more HP, special rules)

### 6. Draft / Arena Mode
**Description:** Build deck from random card offers  
**Duration:** Run of 0-12 wins  
**Objective:** Win as many matches as possible

**Draft Process:**
1. Choose from 3 random cards (30 times)
2. Build 30-card deck from choices
3. Play until 3 losses or 12 wins
4. Earn rewards based on wins

**Rewards Scale:**
- 0-2 wins: Small reward
- 3-5 wins: Break even
- 6-8 wins: Good profit
- 9-11 wins: Great rewards
- 12 wins: Legendary reward

### 7. Event / Challenge Mode
**Description:** Limited-time special events  
**Duration:** 3-7 days  
**Objective:** Complete event-specific goals

**Event Types:**
- **Constructed:** Use your deck with special rules
- **Tavern Brawl:** Pre-made decks with crazy modifiers
- **Boss Rush:** Fight series of bosses
- **Puzzle:** Solve specific board states
- **Team Event:** Cooperative challenges

**Modifiers Examples:**
- All spells cost 0
- Start with 10 energy
- Random card effects
- Double damage
- Shared graveyard

## 🃏 Card System

### Card Anatomy
```
┌─────────────────────┐
│ [Cost]    [Rarity]  │
│                     │
│   [Card Art]        │
│                     │
├─────────────────────┤
│ [Name]              │
│ [Type] - [Faction]  │
├─────────────────────┤
│ [Ability Text]      │
│                     │
├─────────────────────┤
│ [ATK] / [DEF]       │
└─────────────────────┘
```

### Rarities & Drop Rates
- **Common:** 60% - Basic cards, simple effects
- **Rare:** 25% - Solid cards, useful effects
- **Epic:** 10% - Strong cards, complex effects
- **Legendary:** 4% - Powerful cards, unique effects
- **Mythic:** 1% - Game-changing cards, animated art

### Card Mechanics

**Keywords:**
- **Rush:** Can attack immediately
- **Guard:** Must be attacked first
- **Stealth:** Can't be targeted by spells/abilities
- **Lifesteal:** Heal for damage dealt
- **Overwhelm:** Excess damage goes to Nexus
- **Echo:** Returns to hand after played
- **Evolve:** Upgrades when condition met
- **Combo:** Bonus if another card played this turn
- **Frenzy:** Attacks twice
- **Regenerate:** Heals at end of turn
- **Barrier:** Prevents next damage instance
- **Silence:** Remove all abilities
- **Transform:** Become a different card
- **Summon:** Create tokens
- **Draw:** Draw cards
- **Discard:** Discard cards
- **Mill:** Opponent discards from deck
- **Burn:** Direct damage to Nexus
- **Freeze:** Can't attack next turn
- **Stun:** Skip next turn
- **Poison:** Take damage over time

**Synergy Tags:**
- **Tech:** Synergizes with other Tech cards
- **Void:** Synergizes with Void cards
- **Light:** Synergizes with Light cards
- **Fire:** Synergizes with Fire cards
- **Time:** Synergizes with Time cards
- **Nexus:** Synergizes with Nexus cards

### Example Cards

#### Common Unit
**Cyber Scout**
- Cost: 2
- Type: Unit - Techborn
- Stats: 2/3
- Ability: None
- Flavor: "First line of defense in the digital frontier."

#### Rare Spell
**Data Surge**
- Cost: 3
- Type: Spell
- Ability: Draw 2 cards. If you control a Tech unit, draw 3 instead.
- Flavor: "Information is power."

#### Epic Unit
**Void Assassin**
- Cost: 4
- Type: Unit - Voidwalker
- Stats: 4/2
- Ability: Stealth, Rush. When this attacks, deal 2 damage to a random enemy unit.
- Flavor: "Strike from the shadows."

#### Legendary Unit
**Chronos Warden**
- Cost: 7
- Type: Unit - Chronos
- Stats: 5/7
- Ability: At the end of your turn, take an extra turn. This ability can only trigger once per game.
- Flavor: "Time bends to my will."

#### Mythic Spell
**Reality Fracture**
- Cost: 10
- Type: Spell
- Ability: Destroy all units. For each unit destroyed, summon a 1/1 Void Token. Draw cards equal to the number of tokens summoned.
- Flavor: "When reality breaks, chaos reigns."
- Special: Animated holographic effect

## 💰 Economy System

### Currencies

**Soft Currency (Credits)**
- Earned through: Matches, quests, battle pass, events
- Used for: Card packs, common cosmetics, upgrades
- Daily cap: None
- Generous earning rate

**Premium Currency (Nexus Shards)**
- Earned through: Battle pass, achievements, rare rewards
- Used for: Premium packs, exclusive cosmetics, battle pass
- Can be earned F2P (slowly)
- Optional purchase (if monetization needed)

**Poker Chips**
- Earned through: Poker mode, daily login, quests
- Used for: Poker tables, tournaments
- Can exchange with Credits (rate-limited)
- Separate economy from main game

**Crafting Dust**
- Earned through: Disenchanting cards, rewards
- Used for: Crafting specific cards
- Allows targeted collection building
- Rarity-based costs:
  - Common: 40 dust
  - Rare: 100 dust
  - Epic: 400 dust
  - Legendary: 1600 dust
  - Mythic: 3200 dust

### Card Acquisition

**Card Packs:**
- **Standard Pack:** 5 cards, 100 Credits
  - 4 Common, 1 Rare or better
- **Premium Pack:** 5 cards, 200 Nexus Shards
  - 3 Rare, 1 Epic, 1 Legendary or better
- **Faction Pack:** 5 cards from specific faction, 150 Credits

**Guaranteed Drops:**
- 1 Epic every 10 packs
- 1 Legendary every 40 packs
- No duplicate Legendaries until collection complete

**Other Sources:**
- Quest rewards
- Battle pass tiers
- Event rewards
- Achievement rewards
- Level-up rewards
- Crafting with dust

### Progression Systems

**Account Level:**
- Max level: 100
- XP from: Matches, quests, achievements
- Rewards: Cards, packs, currency, cosmetics
- Prestige system after level 100

**Card Levels:**
- Cards can be upgraded (max level 5)
- Requires duplicate cards or dust
- Provides small stat boosts (+1 ATK/DEF per level)
- Visual upgrade (golden border, particles)
- Only for PvE and casual modes (not ranked)

**Battle Pass:**
- Free track: 50 tiers
- Premium track: 50 tiers (costs Nexus Shards)
- Duration: 2 months (matches ranked season)
- Rewards: Cards, packs, cosmetics, currency, emotes
- XP from: Daily quests, weekly quests, matches

### Quests System

**Daily Quests (3 per day):**
- Play 5 matches: 50 Credits
- Win 3 matches: 100 Credits
- Play 10 Tech cards: 75 Credits
- Deal 50 damage: 75 Credits
- Destroy 10 units: 100 Credits

**Weekly Quests (3 per week):**
- Win 15 matches: 500 Credits + 1 Rare card
- Play 50 matches: 300 Credits
- Complete 10 daily quests: 400 Credits + 100 dust
- Win 5 ranked matches: 600 Credits + 1 Epic card

**Achievement Quests:**
- One-time permanent achievements
- Rewards: Titles, cosmetics, currency, exclusive cards
- Examples:
  - Win 100 matches: "Veteran" title + 1000 Credits
  - Collect 100 unique cards: "Collector" title + 500 dust
  - Reach Diamond rank: "Elite" title + Legendary card
  - Win with all factions: "Master" title + Mythic card back

## 🎨 Cosmetics & Customization

### Card Cosmetics
- **Alternate Art:** Different illustration for same card
- **Animated Cards:** Moving artwork (Mythic default)
- **Golden Cards:** Shiny golden border and particles
- **Holographic:** Rainbow holographic effect
- **Seasonal Variants:** Limited-time themed versions

### Profile Customization
- **Avatars:** Character portraits
- **Frames:** Border around avatar
- **Titles:** Text under name
- **Card Backs:** Deck back design
- **Emotes:** In-game reactions (6 slots)
- **Victory Animations:** Special effects on win
- **Nexus Skins:** Custom Nexus appearance

### Rarity Tiers for Cosmetics
- Common: Easy to obtain
- Rare: Moderate effort
- Epic: Significant achievement
- Legendary: Major milestone
- Exclusive: Limited-time or special events

## 🏆 Social & Competitive Features

### Friends System
- Add friends via Telegram username
- Friend list (max 100)
- See online status
- Challenge to duel
- Send gifts (emotes, card backs)
- Spectate matches

### Leaderboards
- **Global:** Top 1000 players worldwide
- **Regional:** Top 100 in your region
- **Friends:** Compare with friends
- **Faction:** Best players per faction
- **Poker:** Separate poker leaderboard

### Tournaments
- **Daily Tournaments:** Free entry, small rewards
- **Weekly Tournaments:** Entry fee, bigger rewards
- **Monthly Championships:** Invite-only for top players
- **Special Events:** Themed tournaments with unique rules

### Guilds/Clans (Future Feature)
- Create or join guild
- Guild chat
- Guild vs Guild events
- Shared rewards
- Guild leaderboard

## 🎯 Retention & Engagement Mechanics

### Daily Login Rewards
- Day 1: 50 Credits
- Day 2: 75 Credits
- Day 3: 100 Credits + 50 dust
- Day 4: 150 Credits
- Day 5: 200 Credits + 1 Rare card
- Day 6: 250 Credits + 100 dust
- Day 7: 500 Credits + 1 Epic card + 1 Premium Pack

### Comeback Mechanics
- Returning after 7+ days: Welcome back pack
- Returning after 30+ days: Premium welcome pack + bonus XP

### Limited-Time Events
- Weekly rotating events
- Seasonal celebrations
- Special challenges
- Exclusive rewards
- FOMO-driven engagement

### Progression Milestones
- Clear visual progress bars
- Frequent small rewards
- Meaningful long-term goals
- Multiple progression tracks
- Always something to work toward

## 🛡️ Balance Philosophy

### Design Principles
1. **Counterplay:** Every strategy has counters
2. **Diversity:** Multiple viable deck archetypes
3. **Skill Expression:** Decisions matter more than luck
4. **Accessibility:** Easy to learn, hard to master
5. **Fun First:** Winning feels good, losing doesn't feel terrible

### Balance Levers
- Card stats (ATK/DEF)
- Energy costs
- Ability power
- Rarity distribution
- Synergy strength
- Draw consistency

### Meta Management
- Monthly balance patches
- Seasonal card rotations (for some modes)
- New card releases
- Event-specific bans/buffs
- Community feedback integration

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-22  
**Status:** Initial Design
