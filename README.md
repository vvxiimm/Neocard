# Nexus Cards

Premium card battler game for Telegram Mini App with deep strategic gameplay, poker mode, and beautiful UI.

## 🎮 Features

- **Multiple Game Modes**: Classic Battle, Fast Mode, Ranked, Poker, PvE, Draft, Events
- **Deep Card System**: 5 rarities, multiple factions, synergies, and abilities
- **Progression Systems**: Levels, ranks, battle pass, quests, achievements
- **Economy**: Multiple currencies, crafting, shop, packs
- **Social Features**: Friends, leaderboards, tournaments
- **Premium UI/UX**: Glassmorphism, animations, particle effects
- **Telegram Integration**: Seamless WebApp authentication

## 🏗️ Architecture

### Monorepo Structure
```
nexus-cards/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared/       # Shared types & constants
│   └── game-core/    # Pure game logic
└── docker/           # Docker configurations
```

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- TanStack Query
- Socket.io Client
- Telegram WebApp SDK

**Backend:**
- NestJS
- TypeScript
- PostgreSQL + Prisma
- Redis
- Socket.io
- JWT Authentication

**Game Engine:**
- Pure TypeScript game logic
- Server-authoritative design
- Event-driven architecture

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd nexus-cards
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your values

# Frontend
cp apps/web/.env.local.example apps/web/.env.local
```

4. Start services with Docker:
```bash
docker-compose up -d postgres redis
```

5. Run database migrations:
```bash
pnpm db:generate
pnpm db:push
```

6. Seed the database (optional):
```bash
pnpm db:seed
```

7. Start development servers:
```bash
# Terminal 1 - Backend
pnpm --filter @nexus/api dev

# Terminal 2 - Frontend
pnpm --filter @nexus/web dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Prisma Studio: `pnpm db:studio`

### Docker Development

Run everything with Docker:
```bash
docker-compose up
```

## 📚 Documentation

- [Architecture Document](./ARCHITECTURE.md) - System design and technical decisions
- [Game Design Document](./GAME_DESIGN.md) - Game mechanics and rules
- [API Documentation](./apps/api/README.md) - Backend API reference
- [Frontend Guide](./apps/web/README.md) - Frontend structure and components

## 🎯 Game Modes

### Classic Battle
Strategic 1v1 card battles with energy system, unit combat, and spell casting.

### Poker Mode
Texas Hold'em poker with virtual chips, tournaments, and cash tables.

### Fast Mode
Quick 3-minute matches perfect for mobile sessions.

### Ranked Mode
Competitive ladder with 7 tiers, divisions, and seasonal rewards.

### PvE / Story Mode
Campaign against AI opponents with progressive difficulty.

### Draft / Arena Mode
Build deck from random offers, play until 3 losses or 12 wins.

### Event / Challenge Mode
Limited-time events with special rules and exclusive rewards.

## 🃏 Card System

- **Rarities**: Common, Rare, Epic, Legendary, Mythic
- **Types**: Units, Spells, Artifacts, Reactions
- **Factions**: Techborn, Voidwalker, Lumina, Wildfire, Chronos, Nexus
- **Keywords**: Rush, Guard, Stealth, Lifesteal, Overwhelm, and more
- **Abilities**: Triggered effects, passive bonuses, combos

## 💰 Economy

- **Credits**: Soft currency for packs and upgrades
- **Nexus Shards**: Premium currency for exclusive items
- **Poker Chips**: Used in poker mode
- **Crafting Dust**: Craft specific cards

## 🛠️ Development

### Project Scripts

```bash
# Development
pnpm dev                    # Start all services
pnpm build                  # Build all packages
pnpm test                   # Run tests
pnpm lint                   # Lint code

# Database
pnpm db:generate            # Generate Prisma client
pnpm db:push                # Push schema to database
pnpm db:migrate             # Run migrations
pnpm db:studio              # Open Prisma Studio
pnpm db:seed                # Seed database

# Individual packages
pnpm --filter @nexus/api dev
pnpm --filter @nexus/web dev
```

### Code Structure

**Backend Modules:**
- `auth` - Telegram WebApp authentication
- `users` - User profiles and progression
- `cards` - Card definitions and collections
- `decks` - Deck building and validation
- `matches` - Match management and game engine
- `economy` - Currency and transactions
- `shop` - Store and purchases
- `quests` - Daily/weekly quests
- `social` - Friends and leaderboards
- `poker` - Poker tables and logic
- `events` - WebSocket gateway

**Frontend Structure:**
- `app/` - Next.js pages and layouts
- `components/` - React components
- `hooks/` - Custom React hooks
- `store/` - Zustand state management
- `lib/` - Utilities and API client

## 🔐 Security

- Server-authoritative game logic
- Telegram WebApp data validation
- JWT authentication
- Rate limiting
- Input validation with Zod
- Transaction atomicity
- Audit logging

## 📈 Scalability

- Stateless API servers (horizontal scaling)
- Redis for caching and sessions
- Database connection pooling
- WebSocket scaling with Redis adapter
- Queue workers for async tasks
- CDN for static assets

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## 📦 Deployment

### Production Build

```bash
pnpm build
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

See `.env.example` files in each app for required variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary software.

## 🎨 Design System

- **Colors**: Neon cyan, electric purple, gold accents
- **Typography**: Orbitron (headings), Inter (body), JetBrains Mono (numbers)
- **Effects**: Glassmorphism, glow, particles, gradients
- **Animations**: Framer Motion for smooth transitions

## 🔮 Roadmap

- [ ] Spectator mode
- [ ] Replay system
- [ ] Tournament system
- [ ] Guild/clan system
- [ ] Trading system
- [ ] Seasonal events
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered matchmaking
- [ ] Voice chat integration

## 📞 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ for the Telegram gaming community**
