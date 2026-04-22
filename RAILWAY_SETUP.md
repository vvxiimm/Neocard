# 🚂 НАСТРОЙКА RAILWAY - ПОШАГОВАЯ ИНСТРУКЦИЯ

## ✅ ВСЕ ФАЙЛЫ КОНФИГУРАЦИИ ГОТОВЫ

В проекте уже созданы все необходимые файлы:
- ✅ `package.json` - исправлен синтаксис, Node 20.x
- ✅ `railway.json` - конфигурация Railway
- ✅ `nixpacks.toml` - конфигурация сборки
- ✅ `Procfile` - команда запуска
- ✅ `.railwayignore` - игнорируемые файлы

---

## ЭТАП 1: СОЗДАНИЕ ПРОЕКТА НА RAILWAY

### Шаг 1: Регистрация
1. Откройте [railway.app](https://railway.app)
2. Нажмите **"Start a New Project"**
3. Войдите через **GitHub**

### Шаг 2: Создание проекта
1. Нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Найдите репозиторий: **`vvxiimm/Neocard`**
4. Нажмите **"Deploy Now"**

Railway автоматически:
- Обнаружит монорепо
- Прочитает `railway.json` и `nixpacks.toml`
- Начнет сборку

---

## ЭТАП 2: ДОБАВЛЕНИЕ БАЗ ДАННЫХ

### Шаг 2.1: PostgreSQL

1. В проекте нажмите **"+ New"**
2. Выберите **"Database"** → **"Add PostgreSQL"**
3. Railway автоматически создаст базу данных
4. Переменная `DATABASE_URL` будет доступна автоматически

### Шаг 2.2: Redis

1. Нажмите **"+ New"** → **"Database"** → **"Add Redis"**
2. Railway создаст Redis инстанс
3. Переменная `REDIS_URL` будет доступна автоматически

---

## ЭТАП 3: НАСТРОЙКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ

### Шаг 3.1: Откройте настройки сервиса

1. Нажмите на сервис с вашим кодом (не на базы данных)
2. Перейдите на вкладку **"Variables"**

### Шаг 3.2: Добавьте переменные

Нажмите **"+ New Variable"** и добавьте каждую:

```env
NODE_ENV=production
```

```env
PORT=3001
```

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

```env
REDIS_URL=${{Redis.REDIS_URL}}
```

```env
JWT_SECRET=ваш-супер-секретный-ключ-минимум-32-символа-случайная-строка
```

```env
TELEGRAM_BOT_TOKEN=ваш-токен-от-botfather
```

**Как получить JWT_SECRET:**
```bash
# В терминале выполните:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Как получить TELEGRAM_BOT_TOKEN:**
1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте токен (формат: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Шаг 3.3: Сохраните

Нажмите **"Add"** для каждой переменной.

---

## ЭТАП 4: НАСТРОЙКА СБОРКИ (если нужно)

Railway должен автоматически использовать настройки из `railway.json` и `nixpacks.toml`.

Если нужно настроить вручную:

### Перейдите в Settings → Build

**Build Command:**
```bash
pnpm db:generate && pnpm --filter @nexus/api build
```

**Start Command:**
```bash
cd apps/api && pnpm db:push && node dist/main.js
```

**Install Command:**
```bash
npm install -g pnpm@8.15.3 && pnpm install --frozen-lockfile
```

---

## ЭТАП 5: ДЕПЛОЙ

### Шаг 5.1: Запуск деплоя

1. Railway автоматически начнет деплой после добавления переменных
2. Или нажмите **"Deploy"** вручную

### Шаг 5.2: Мониторинг логов

1. Перейдите на вкладку **"Deployments"**
2. Нажмите на последний деплой
3. Смотрите логи в реальном времени

**Что вы должны увидеть:**
```
✓ Installing pnpm
✓ Installing dependencies
✓ Generating Prisma Client
✓ Building @nexus/api
✓ Pushing database schema
✓ Starting application
✓ Server listening on port 3001
```

### Шаг 5.3: Получение URL

1. Перейдите в **"Settings"** → **"Networking"**
2. Нажмите **"Generate Domain"**
3. Railway создаст домен типа: `neocard-production.up.railway.app`
4. **СОХРАНИТЕ ЭТОТ URL** - он нужен для frontend!

---

## ЭТАП 6: ПРОВЕРКА РАБОТОСПОСОБНОСТИ

### Тест 1: Проверка API

Откройте в браузере:
```
https://ваш-домен.up.railway.app
```

Должны увидеть ответ от сервера (или 404, если нет корневого роута).

### Тест 2: Проверка WebSocket

```
https://ваш-домен.up.railway.app/game
```

### Тест 3: Проверка базы данных

В Railway:
1. Откройте сервис **PostgreSQL**
2. Перейдите на вкладку **"Data"**
3. Должны увидеть таблицы: `User`, `Card`, `Deck`, `Match` и т.д.

---

## 🐛 РЕШЕНИЕ ПРОБЛЕМ

### Проблема: "Failed to initialize provider `node`"

**Причина:** Ошибка в package.json или кэш Railway

**Решение:**
1. Убедитесь что последний коммит запушен: `git push origin main`
2. В Railway: **Settings** → **Redeploy**
3. Или удалите сервис и создайте заново

### Проблема: "Prisma Client not generated"

**Решение:**
1. Проверьте логи сборки
2. Убедитесь что команда `pnpm db:generate` выполняется
3. Проверьте что `DATABASE_URL` установлен

### Проблема: "Cannot connect to database"

**Решение:**
1. Проверьте что PostgreSQL сервис запущен
2. Убедитесь что `DATABASE_URL=${{Postgres.DATABASE_URL}}`
3. Проверьте что оба сервиса в одном проекте

### Проблема: "Port already in use"

**Решение:**
1. Убедитесь что `PORT=3001` установлен
2. В коде используйте: `process.env.PORT || 3001`

### Проблема: "Module not found"

**Решение:**
1. Проверьте что `pnpm install` выполнился
2. Убедитесь что `node_modules` не в `.railwayignore`
3. Попробуйте: **Settings** → **Clear Build Cache** → **Redeploy**

---

## 📊 СТРУКТУРА ПРОЕКТА НА RAILWAY

```
Railway Project: Neocard
│
├── 🗄️ PostgreSQL
│   ├── DATABASE_URL (автоматически)
│   └── Tables: User, Card, Deck, Match...
│
├── 🔴 Redis
│   └── REDIS_URL (автоматически)
│
└── 🚀 API Service (ваш код)
    ├── Build:
    │   ├── Install pnpm
    │   ├── pnpm install
    │   ├── pnpm db:generate
    │   └── pnpm build
    │
    ├── Start:
    │   ├── cd apps/api
    │   ├── pnpm db:push
    │   └── node dist/main.js
    │
    └── Variables:
        ├── NODE_ENV=production
        ├── PORT=3001
        ├── DATABASE_URL (из PostgreSQL)
        ├── REDIS_URL (из Redis)
        ├── JWT_SECRET (вручную)
        └── TELEGRAM_BOT_TOKEN (вручную)
```

---

## 📝 ЧЕКЛИСТ ГОТОВНОСТИ

Перед тем как продолжить к frontend:

- [ ] Railway проект создан
- [ ] PostgreSQL добавлен и работает
- [ ] Redis добавлен и работает
- [ ] Все переменные окружения установлены
- [ ] Деплой прошел успешно (зеленая галочка)
- [ ] Логи не показывают ошибок
- [ ] Домен сгенерирован
- [ ] API отвечает по URL
- [ ] База данных содержит таблицы

---

## 🎯 СЛЕДУЮЩИЙ ШАГ: FRONTEND

После успешного деплоя backend:

1. Скопируйте URL вашего API: `https://ваш-домен.up.railway.app`
2. Переходите к деплою frontend на Vercel
3. Следуйте инструкции в `TELEGRAM_DEPLOYMENT.md` (Этап 4)

---

## 💡 ПОЛЕЗНЫЕ КОМАНДЫ

### Просмотр логов в реальном времени:
```bash
# Установите Railway CLI
npm i -g @railway/cli

# Войдите
railway login

# Подключитесь к проекту
railway link

# Смотрите логи
railway logs
```

### Выполнение команд на Railway:
```bash
# Запуск миграций
railway run pnpm --filter @nexus/api db:push

# Заполнение базы данных
railway run pnpm --filter @nexus/api db:seed

# Prisma Studio
railway run pnpm --filter @nexus/api db:studio
```

---

## 🔒 БЕЗОПАСНОСТЬ

**ВАЖНО:**
- ✅ Никогда не коммитьте `.env` файлы
- ✅ Используйте сильные JWT_SECRET (минимум 32 символа)
- ✅ Регулярно меняйте секреты
- ✅ Не делитесь TELEGRAM_BOT_TOKEN
- ✅ Включите 2FA на GitHub и Railway

---

**Дата создания:** 2026-04-22  
**Версия:** 2.0.0  
**Статус:** ✅ ГОТОВО К ИСПОЛЬЗОВАНИЮ

**Ваш репозиторий:** https://github.com/vvxiimm/Neocard
