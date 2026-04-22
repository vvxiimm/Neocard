# 🚀 ИНСТРУКЦИЯ ПО СБОРКЕ И ПУБЛИКАЦИИ NEXUS CARDS

## ✅ ИСПРАВЛЕННЫЕ ОШИБКИ

### 1. Добавлены отсутствующие зависимости
- `@nestjs/passport` - для JWT стратегии
- `passport` и `passport-jwt` - для аутентификации
- `ts-loader` - для webpack сборки NestJS
- `@types/passport-jwt` - типы для TypeScript

### 2. Исправлены ошибки типизации
- Изменен тип `GameAction` на discriminated union для правильной типизации
- Добавлены явные типы `any` для Prisma результатов
- Исправлена типизация в `calculateMatchRewards`

---

## 📦 УСТАНОВКА И СБОРКА

### Шаг 1: Установка зависимостей
```bash
cd "M:/прога лаба/laba2k/WEB-Poker"
pnpm install
```

### Шаг 2: Настройка окружения

Создайте файлы `.env`:

**Backend** (`apps/api/.env`):
```env
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/nexus_cards?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Telegram
TELEGRAM_BOT_TOKEN="your-telegram-bot-token-from-botfather"
```

**Frontend** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Шаг 3: Запуск баз данных

**Вариант A: Docker (рекомендуется)**
```bash
docker-compose up -d postgres redis
```

**Вариант B: Локальная установка**
- Установите PostgreSQL 16
- Установите Redis 7
- Запустите оба сервиса

### Шаг 4: Настройка базы данных
```bash
# Генерация Prisma клиента
pnpm db:generate

# Создание таблиц
pnpm db:push

# Заполнение карточками (60 карт)
pnpm --filter @nexus/api db:seed
```

### Шаг 5: Сборка проекта
```bash
pnpm build
```

Если сборка прошла успешно, вы увидите:
```
✓ Compiled successfully
```

---

## 🏃 ЗАПУСК В РЕЖИМЕ РАЗРАБОТКИ

### Вариант 1: Все сразу (требует 2 терминала)

**Терминал 1 - Backend:**
```bash
pnpm --filter @nexus/api dev
```

**Терминал 2 - Frontend:**
```bash
pnpm --filter @nexus/web dev
```

### Вариант 2: Через Docker Compose
```bash
docker-compose up
```

### Доступ к приложению:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Prisma Studio:** `pnpm db:studio` (http://localhost:5555)

---

## 🌐 ПУБЛИКАЦИЯ В PRODUCTION

### Вариант 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend на Vercel:

1. **Подготовка:**
```bash
cd apps/web
```

2. **Установка Vercel CLI:**
```bash
npm i -g vercel
```

3. **Деплой:**
```bash
vercel --prod
```

4. **Настройка переменных окружения в Vercel:**
- `NEXT_PUBLIC_API_URL` = URL вашего backend API

#### Backend на Railway:

1. **Создайте аккаунт на [Railway.app](https://railway.app)**

2. **Создайте новый проект:**
   - New Project → Deploy from GitHub
   - Выберите ваш репозиторий
   - Root Directory: `apps/api`

3. **Добавьте сервисы:**
   - PostgreSQL (автоматически)
   - Redis (из Marketplace)

4. **Настройте переменные окружения:**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=your-production-secret
TELEGRAM_BOT_TOKEN=your-bot-token
```

5. **Настройте build команды:**
   - Build Command: `cd ../.. && pnpm install && pnpm --filter @nexus/api build`
   - Start Command: `node dist/main.js`

---

### Вариант 2: VPS (DigitalOcean, AWS, etc.)

#### 1. Подготовка сервера (Ubuntu 22.04):

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установка pnpm
npm install -g pnpm

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo apt install docker-compose -y
```

#### 2. Клонирование проекта:

```bash
cd /var/www
git clone <your-repo-url> nexus-cards
cd nexus-cards
```

#### 3. Настройка окружения:

```bash
# Создайте .env файлы
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# Отредактируйте их
nano apps/api/.env
nano apps/web/.env.local
```

#### 4. Запуск через Docker Compose:

```bash
# Production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

#### 5. Настройка Nginx (reverse proxy):

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/nexus-cards
```

Конфигурация Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Активация:
```bash
sudo ln -s /etc/nginx/sites-available/nexus-cards /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL сертификат (Let's Encrypt):

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

### Вариант 3: Telegram Mini App Hosting

#### 1. Подготовка для Telegram:

Telegram Mini Apps требуют HTTPS. Используйте один из вариантов выше с SSL.

#### 2. Создание Telegram бота:

1. Откройте [@BotFather](https://t.me/BotFather)
2. Создайте бота: `/newbot`
3. Получите токен
4. Настройте Web App:
   ```
   /newapp
   /setappdescription
   /setappphoto
   /setappshortname
   ```

5. Укажите URL вашего frontend (с HTTPS!)

#### 3. Настройка Web App:

В `apps/web/src/app/layout.tsx` добавьте:
```tsx
<head>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
```

---

## 🔧 PRODUCTION CHECKLIST

### Безопасность:
- [ ] Смените `JWT_SECRET` на случайную строку
- [ ] Используйте сильные пароли для БД
- [ ] Настройте CORS правильно
- [ ] Включите rate limiting
- [ ] Настройте firewall (UFW)
- [ ] Регулярные бэкапы БД

### Производительность:
- [ ] Настройте Redis для кеширования
- [ ] Включите gzip compression в Nginx
- [ ] Настройте CDN для статики (Cloudflare)
- [ ] Оптимизируйте изображения карт
- [ ] Настройте connection pooling для БД

### Мониторинг:
- [ ] Настройте логирование (Winston)
- [ ] Добавьте error tracking (Sentry)
- [ ] Настройте uptime monitoring
- [ ] Добавьте метрики (Prometheus)

---

## 📊 МОНИТОРИНГ И ЛОГИ

### Просмотр логов Docker:
```bash
docker-compose logs -f api
docker-compose logs -f web
```

### Просмотр логов на VPS:
```bash
# Backend
pm2 logs api

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔄 ОБНОВЛЕНИЕ PRODUCTION

### Через Git:
```bash
cd /var/www/nexus-cards
git pull origin main
pnpm install
pnpm build
docker-compose restart
```

### Через CI/CD (GitHub Actions):

Создайте `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/nexus-cards
            git pull
            pnpm install
            pnpm build
            docker-compose restart
```

---

## 🐛 TROUBLESHOOTING

### Ошибка: "Cannot find module '@nestjs/passport'"
```bash
cd apps/api
pnpm add @nestjs/passport passport passport-jwt
pnpm add -D @types/passport-jwt
```

### Ошибка: "ts-loader not found"
```bash
cd apps/api
pnpm add -D ts-loader
```

### Ошибка подключения к БД:
```bash
# Проверьте что PostgreSQL запущен
docker ps | grep postgres

# Проверьте строку подключения
echo $DATABASE_URL
```

### Ошибка WebSocket:
- Проверьте что порт 3001 открыт
- Убедитесь что Nginx правильно проксирует WebSocket
- Проверьте CORS настройки

---

## 📞 ПОДДЕРЖКА

При возникновении проблем:
1. Проверьте логи: `docker-compose logs`
2. Проверьте переменные окружения
3. Убедитесь что все сервисы запущены
4. Проверьте firewall правила

---

## ✅ ГОТОВО!

После выполнения всех шагов ваша игра будет доступна по адресу:
- **Development:** http://localhost:3000
- **Production:** https://your-domain.com

**Telegram Mini App:** Откройте бота и запустите Web App!

---

**Дата создания:** 2026-04-22  
**Версия:** 1.0.0  
**Статус:** ✅ ГОТОВО К ПУБЛИКАЦИИ
