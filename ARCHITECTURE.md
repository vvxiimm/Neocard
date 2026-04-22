# Nexus Cards - Architecture Document

## 🎯 Project Vision

Premium card battler game for Telegram Mini App with:
- Deep strategic card gameplay
- Poker mode integration
- Multiple game modes (PvE, PvP, Ranked, Draft, Events)
- Rich progression systems
- Beautiful UI/UX with cinematic animations
- Scalable backend architecture
- Anti-cheat protection

## 🏗️ Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + CSS Modules for complex animations
- **State Management:** Zustand (lightweight, perfect for games)
- **Server State:** TanStack Query (React Query v5)
- **Animations:** Framer Motion + CSS animations + Canvas for card effects
- **WebSocket:** Socket.io-client
- **Telegram:** @twa-dev/sdk
- **UI Components:** Radix UI primitives + custom components
- **Icons:** Lucide React
- **Build:** Turbopack (Next.js 14 default)

**Why Next.js over Vite:**
- Better SSR/SSG for initial load optimization
- Built-in API routes for BFF pattern
- Image optimization out of the box
- Better production deployment story
- App Router for modern React patterns

### Backend
- **Framework:** NestJS (enterprise-grade, modular architecture)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL 16
- **Cache/Queue:** Redis 7
- **ORM:** Prisma (better DX, type safety, migrations)
- **WebSocket:** Socket.io with NestJS Gateway
- **Auth:** JWT + Telegram WebApp validation
- **Validation:** class-validator + class-transformer
- **Queue:** BullMQ (Redis-based)
- **Logging:** Winston + structured logs
- **Monitoring:** Prometheus metrics hooks

**Why Prisma over TypeORM:**
- Superior type safety
- Better migration workflow
- Cleaner query API
- Built-in connection pooling
- Better performance for read-heavy workloads

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Package Manager:** pnpm (faster, better monorepo support)
- **Monorepo:** Turborepo
- **Environment:** dotenv-cli + typed config
- **Testing:** Vitest (unit) + Playwright (e2e)
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged

## 📁 Project Structure

```
nexus-cards/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/           # App router pages
│   │   │   ├── components/    # React components
│   │   │   ├── features/      # Feature-based modules
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── lib/           # Utilities
│   │   │   ├── store/         # Zustand stores
│   │   │   └── styles/        # Global styles
│   │   └── public/            # Static assets
│   │
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── modules/       # Feature modules
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── cards/
│       │   │   ├── decks/
│       │   │   ├── matches/
│       │   │   ├── poker/
│       │   │   ├── economy/
│       │   │   ├── shop/
│       │   │   ├── quests/
│       │   │   ├── social/
│       │   │   ├── leaderboard/
│       │   │   └── events/
│       │   ├── game-engine/   # Core game logic
│       │   ├── common/        # Shared utilities
│       │   ├── config/        # Configuration
│       │   └── database/      # Prisma client
│       └── prisma/            # Database schema
│
├── packages/
│   ├── shared/                # Shared types & constants
│   │   ├── types/
│   │   ├── constants/
│   │   └── validators/
│   │
│   ├── game-core/             # Pure game logic (no framework deps)
│   │   ├── cards/
│   │   ├── battle/
│   │   ├── poker/
│   │   └── rules/
│   │
│   └── ui/                    # Shared UI components
│       ├── components/
│       └── animations/
│
├── docker/
│   ├── Dockerfile.web
│   ├── Dockerfile.api
│   └── docker-compose.yml
│
├── .github/
│   └── workflows/
│
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

## 🎮 Game Design Core Loop

### Primary Loop (Classic Battle Mode)
1. **Deck Selection** → Choose/build deck (30 cards)
2. **Matchmaking** → Find opponent (AI or player)
3. **Battle Phase:**
   - Draw starting hand (5 cards)
   - Each turn: Draw 1 card, gain 1 energy (max 10)
   - Play cards by spending energy
   - Attack opponent's nexus (20 HP)
   - Use card abilities, combos, synergies
4. **Victory/Defeat** → Earn rewards (XP, currency, cards)
5. **Progression** → Level up, unlock cards, complete quests
6. **Loop back** → Improve deck, try new strategies

### Card Mechanics
- **Energy System:** 0-10 energy, +1 per turn
- **Card Types:**
  - **Units:** Attack/Defense stats, can attack nexus or other units
  - **Spells:** Instant effects (damage, buff, debuff, draw, etc.)
  - **Artifacts:** Persistent field effects
  - **Reactions:** Triggered abilities (on play, on death, on attack, etc.)
- **Rarities:** Common, Rare, Epic, Legendary, Mythic
- **Tags:** Element types (Fire, Water, Tech, Void, Light, Shadow)
- **Synergies:** Cards with same tags get bonuses

### Win Conditions
- Reduce opponent's Nexus HP to 0
- Opponent runs out of cards (deck-out)
- Special win condition cards (rare)

### Poker Mode
- Separate mode using virtual chips
- Texas Hold'em rules
- Tournaments and cash tables
- Integrated with main economy (chips ↔ soft currency exchange)

## 🗄️ Database Schema (High-Level)

### Core Entities
- **users:** Telegram user data, auth tokens
- **profiles:** Game profile (level, XP, avatar, title)
- **card_definitions:** Master card data (stats, abilities, art)
- **user_cards:** Player's card inventory (owned cards + levels)
- **decks:** Player's deck configurations
- **deck_cards:** Cards in each deck
- **matches:** Match history and state
- **match_events:** Event log for replay/validation
- **currencies:** User balances (soft, premium, chips, dust)
- **transactions:** Audit log for economy
- **quests:** Quest definitions
- **user_quests:** Quest progress
- **battle_pass:** Season pass tiers
- **user_battle_pass:** User progress
- **shop_offers:** Shop items
- **purchases:** Purchase history
- **friends:** Friend relationships
- **leaderboards:** Ranking data
- **achievements:** Achievement definitions
- **user_achievements:** Unlocked achievements
- **cosmetics:** Skins, frames, emotes
- **user_cosmetics:** Owned cosmetics

### Key Relationships
- User → Profile (1:1)
- User → UserCards (1:N)
- User → Decks (1:N)
- Deck → DeckCards (1:N)
- CardDefinition → UserCards (1:N)
- Match → MatchPlayers (1:N)
- Match → MatchEvents (1:N)

## 🔐 Security & Anti-Cheat

### Server-Authoritative Design
- All game logic runs on server
- Client only renders state
- Server validates every action
- Match state stored server-side
- Replay system for audit

### Validation Layers
1. **Auth:** Telegram initData validation
2. **Input:** DTO validation with class-validator
3. **Business Logic:** Game rules enforcement
4. **Economy:** Transaction atomicity
5. **Rate Limiting:** Redis-based throttling
6. **Idempotency:** Request deduplication

### Anti-Cheat Measures
- Server calculates all RNG
- Client can't modify deck mid-match
- Action timestamps validated
- Impossible actions rejected
- Suspicious patterns flagged
- Audit trail for all economy operations

## 🌐 API Design

### REST Endpoints
- `POST /auth/telegram` - Authenticate with Telegram
- `GET /profile` - Get user profile
- `GET /cards` - Get card collection
- `POST /decks` - Create deck
- `GET /shop` - Get shop offers
- `POST /shop/purchase` - Buy item
- `GET /quests` - Get active quests
- `GET /leaderboard` - Get rankings
- `GET /matches/history` - Match history

### WebSocket Events
**Client → Server:**
- `match:join` - Join matchmaking
- `match:action` - Play card, attack, etc.
- `match:surrender` - Forfeit match
- `poker:join_table` - Join poker table
- `poker:action` - Bet, fold, call, raise

**Server → Client:**
- `match:found` - Match started
- `match:state` - Game state update
- `match:event` - Game event (card played, damage dealt)
- `match:end` - Match result
- `poker:table_state` - Poker table update
- `notification` - General notifications

## 📊 Analytics & Telemetry

### Key Metrics
- DAU/MAU/retention
- Match completion rate
- Average session length
- Card usage statistics
- Win rates by deck archetype
- Economy balance (sources/sinks)
- Conversion funnels
- Churn indicators

### Events to Track
- User registration
- Tutorial completion
- First match
- First purchase
- Quest completion
- Level up
- Card unlock
- Deck creation
- Match start/end
- Shop view/purchase
- Social interactions

## 🎨 Visual Design System

### Color Palette
- **Primary:** Neon cyan (#00F0FF)
- **Secondary:** Electric purple (#B026FF)
- **Accent:** Gold (#FFD700)
- **Background:** Deep space (#0A0E27)
- **Surface:** Dark blue-gray (#1A1F3A)
- **Text:** White (#FFFFFF) / Light gray (#E0E0E0)

### Rarity Colors
- **Common:** Gray (#9E9E9E)
- **Rare:** Blue (#2196F3)
- **Epic:** Purple (#9C27B0)
- **Legendary:** Gold (#FFD700)
- **Mythic:** Rainbow gradient

### Typography
- **Headings:** Orbitron (tech feel)
- **Body:** Inter (readability)
- **Numbers:** JetBrains Mono (monospace for stats)

### Animation Principles
- **Duration:** 200-400ms for UI, 600-1000ms for rewards
- **Easing:** ease-out for entrances, ease-in-out for movements
- **Stagger:** 50-100ms between list items
- **Particles:** Subtle, not overwhelming
- **Haptics:** On important actions (card play, victory)

## 🚀 Deployment Strategy

### Development
- Local Docker Compose setup
- Hot reload for both frontend and backend
- Seeded database with test data
- Mock Telegram environment

### Staging
- Separate database
- Real Telegram bot for testing
- Performance monitoring
- Load testing

### Production
- Horizontal scaling ready
- Database connection pooling
- Redis cluster for cache/sessions
- CDN for static assets
- Health checks and auto-restart
- Backup strategy
- Monitoring and alerting

## 📈 Scalability Considerations

### Backend
- Stateless API servers (scale horizontally)
- Redis for session/cache (can cluster)
- Database read replicas for queries
- Queue workers for async tasks
- WebSocket servers can scale with Redis adapter

### Frontend
- Static generation where possible
- CDN for assets
- Code splitting by route
- Lazy loading for heavy components
- Image optimization

### Database
- Proper indexing
- Query optimization
- Partitioning for large tables (matches, events)
- Archiving old data
- Connection pooling

## 🧪 Testing Strategy

### Unit Tests
- Game logic (card effects, battle calculations)
- Economy transactions
- Validation logic
- Utility functions

### Integration Tests
- API endpoints
- Database operations
- WebSocket events
- Auth flow

### E2E Tests
- Critical user flows
- Match gameplay
- Purchase flow
- Deck building

### Performance Tests
- Load testing for concurrent matches
- Database query performance
- WebSocket connection limits
- Memory leak detection

## 📝 Next Steps After Initial Implementation

1. **Content Creation:**
   - Design 100+ unique cards
   - Create card artwork/animations
   - Write lore and flavor text
   - Balance testing

2. **Advanced Features:**
   - Spectator mode
   - Replay system
   - Tournament system
   - Guild/clan system
   - Trading system (if desired)
   - Seasonal events
   - Limited-time modes

3. **Optimization:**
   - Performance profiling
   - Bundle size optimization
   - Database query optimization
   - Caching strategy refinement

4. **Polish:**
   - Sound effects
   - Music
   - Advanced animations
   - Particle effects
   - Haptic feedback
   - Accessibility features

5. **Operations:**
   - Admin dashboard
   - Moderation tools
   - Analytics dashboard
   - A/B testing framework
   - Feature flags system

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-22  
**Status:** Initial Design
