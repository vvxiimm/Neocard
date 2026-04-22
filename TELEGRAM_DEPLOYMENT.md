# 🚀 ПОШАГОВАЯ ИНСТРУКЦИЯ: ПУБЛИКАЦИЯ В TELEGRAM

## 📋 ЧТО ВАМ ПОНАДОБИТСЯ

- Аккаунт Telegram
- Домен с HTTPS (обязательно!)
- Сервер для хостинга (Vercel + Railway или VPS)
- 30-60 минут времени

---

## ЭТАП 1: СОЗДАНИЕ TELEGRAM БОТА

### Шаг 1.1: Откройте BotFather

1. Откройте Telegram
2. Найдите бота [@BotFather](https://t.me/BotFather)
3. Нажмите "Start"

### Шаг 1.2: Создайте нового бота

1. Отправьте команду: `/newbot`
2. BotFather спросит имя бота. Введите: `Nexus Cards` (или любое другое)
3. BotFather попросит username. Введите: `nexus_cards_bot` (должен заканчиваться на `_bot`)
4. **ВАЖНО:** Сохраните токен, который даст BotFather. Выглядит так:
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789
   ```

### Шаг 1.3: Настройте описание бота

```
/setdescription
```
Выберите вашего бота, затем отправьте:
```
⚔️ Nexus Cards - стратегическая карточная игра в Telegram!

🎮 Собирай колоды из 60+ уникальных карт
⚡ Сражайся в режиме реального времени
🏆 Поднимайся в рейтинге
🎁 Открывай паки и получай награды

Начни играть прямо сейчас!
```

### Шаг 1.4: Установите короткое описание

```
/setabouttext
```
Выберите бота, отправьте:
```
⚔️ Стратегическая карточная игра в Telegram
```

### Шаг 1.5: Добавьте фото профиля

```
/setuserpic
```
Выберите бота и загрузите изображение 512x512px (можете создать в Canva или использовать любое изображение с картами)

---

## ЭТАП 2: СОЗДАНИЕ WEB APP

### Шаг 2.1: Создайте Web App

```
/newapp
```
1. Выберите вашего бота
2. BotFather попросит название. Введите: `Nexus Cards`
3. Попросит описание. Введите то же, что в шаге 1.3
4. Попросит фото. Загрузите изображение 640x360px (превью игры)
5. Попросит GIF (опционально). Можете пропустить, отправив `/empty`
6. **ВАЖНО:** Попросит URL. Пока отправьте временный: `https://example.com`
   (Мы обновим его после деплоя)

### Шаг 2.2: Установите короткое имя

```
/setappshortname
```
Выберите бота, затем выберите Web App, введите: `nexuscards`

---

## ЭТАП 3: ДЕПЛОЙ BACKEND (Railway)

### Шаг 3.1: Создайте аккаунт на Railway

1. Перейдите на [railway.app](https://railway.app)
2. Нажмите "Start a New Project"
3. Войдите через GitHub

### Шаг 3.2: Загрузите проект на GitHub

```bash
cd "M:/прога лаба/laba2k/WEB-Poker"

# Инициализируйте git (если еще не сделали)
git init
git add .
git commit -m "Initial commit"

# Создайте репозиторий на GitHub и загрузите
git remote add origin https://github.com/ВАШ_USERNAME/nexus-cards.git
git branch -M main
git push -u origin main
```

### Шаг 3.3: Создайте проект на Railway

1. На Railway нажмите "New Project"
2. Выберите "Deploy from GitHub repo"
3. Выберите ваш репозиторий `nexus-cards`
4. Railway автоматически обнаружит монорепо

### Шаг 3.4: Добавьте PostgreSQL

1. В проекте нажмите "New"
2. Выберите "Database" → "Add PostgreSQL"
3. Railway автоматически создаст базу данных

### Шаг 3.5: Добавьте Redis

1. Нажмите "New" → "Database" → "Add Redis"
2. Railway создаст Redis инстанс

### Шаг 3.6: Настройте Backend сервис

Railway автоматически обнаружит конфигурацию из файлов `railway.json` и `nixpacks.toml`.

Если нужно настроить вручную:
1. Нажмите на сервис с вашим кодом
2. Перейдите в "Settings"
3. Railway автоматически использует настройки из `railway.json`

**Файлы конфигурации уже созданы:**
- `railway.json` - основная конфигурация Railway
- `nixpacks.toml` - конфигурация сборки
- `.railwayignore` - игнорируемые файлы

### Шаг 3.7: Добавьте переменные окружения

В разделе "Variables" добавьте:

```env
NODE_ENV=production
PORT=3001

# Database (Railway автоматически создаст DATABASE_URL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (Railway автоматически создаст REDIS_URL)
REDIS_URL=${{Redis.REDIS_URL}}

# JWT Secret (сгенерируйте случайную строку)
JWT_SECRET=ваш-супер-секретный-ключ-минимум-32-символа

# Telegram Bot Token (из шага 1.2)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789
```

### Шаг 3.8: Получите URL Backend

1. Перейдите в "Settings" → "Networking"
2. Нажмите "Generate Domain"
3. Railway создаст домен типа: `nexus-cards-api.up.railway.app`
4. **СОХРАНИТЕ ЭТОТ URL** - он понадобится для frontend

---

## ЭТАП 4: ДЕПЛОЙ FRONTEND (Vercel)

### Шаг 4.1: Создайте аккаунт на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Sign Up"
3. Войдите через GitHub

### Шаг 4.2: Импортируйте проект

1. На Vercel нажмите "Add New" → "Project"
2. Выберите ваш репозиторий `nexus-cards`
3. Vercel обнаружит Next.js проект

### Шаг 4.3: Настройте проект

1. В "Framework Preset" выберите: `Next.js`
2. В "Root Directory" укажите: `apps/web`
3. В "Build Command" укажите:
   ```bash
   cd ../.. && pnpm install && pnpm --filter @nexus/web build
   ```
4. В "Output Directory" оставьте: `.next`

### Шаг 4.4: Добавьте переменные окружения

В разделе "Environment Variables":

```env
NEXT_PUBLIC_API_URL=https://nexus-cards-api.up.railway.app
```
(Используйте URL из шага 3.8)

### Шаг 4.5: Деплой

1. Нажмите "Deploy"
2. Дождитесь завершения (2-3 минуты)
3. Vercel даст вам URL типа: `nexus-cards.vercel.app`

### Шаг 4.6: Настройте кастомный домен (ОБЯЗАТЕЛЬНО!)

**ВАЖНО:** Telegram Web Apps требуют HTTPS и не работают с `.vercel.app` доменами!

#### Вариант A: Купить домен

1. Купите домен на [namecheap.com](https://namecheap.com) или [reg.ru](https://reg.ru) (~$10/год)
2. В Vercel перейдите в "Settings" → "Domains"
3. Добавьте ваш домен: `nexuscards.com`
4. Следуйте инструкциям Vercel для настройки DNS

#### Вариант B: Использовать бесплатный домен

1. Зарегистрируйтесь на [freenom.com](https://freenom.com)
2. Получите бесплатный домен `.tk`, `.ml`, `.ga`
3. Настройте DNS записи в Vercel

После настройки домена ваше приложение будет доступно по адресу:
```
https://nexuscards.com
```

---

## ЭТАП 5: ОБНОВЛЕНИЕ TELEGRAM БОТА

### Шаг 5.1: Обновите URL Web App

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте: `/myapps`
3. Выберите вашего бота
4. Выберите ваше Web App
5. Нажмите "Edit Web App URL"
6. Введите ваш домен: `https://nexuscards.com`

### Шаг 5.2: Настройте кнопку меню

```
/setmenubutton
```
1. Выберите вашего бота
2. Введите текст кнопки: `🎮 Играть`
3. Введите URL: `https://nexuscards.com`

### Шаг 5.3: Настройте команды

```
/setcommands
```
Выберите бота и отправьте:
```
start - 🎮 Начать игру
play - ⚔️ Играть матч
collection - 🃏 Моя коллекция
decks - 📚 Мои колоды
shop - 🛒 Магазин
profile - 👤 Профиль
help - ❓ Помощь
```

---

## ЭТАП 6: НАСТРОЙКА CORS И БЕЗОПАСНОСТИ

### Шаг 6.1: Обновите CORS в Backend

Откройте `apps/api/src/main.ts` и обновите:

```typescript
app.enableCors({
  origin: [
    'https://nexuscards.com',  // Ваш домен
    'https://web.telegram.org',
  ],
  credentials: true,
});
```

Закоммитьте и запушьте изменения:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Railway автоматически передеплоит backend.

### Шаг 6.2: Добавьте Telegram Web App SDK

Файл уже должен быть в `apps/web/src/app/layout.tsx`:

```tsx
<Script src="https://telegram.org/js/telegram-web-app.js" />
```

Если его нет - добавьте.

---

## ЭТАП 7: ТЕСТИРОВАНИЕ

### Шаг 7.1: Откройте бота

1. Найдите вашего бота в Telegram: `@nexus_cards_bot`
2. Нажмите "Start"
3. Нажмите кнопку "🎮 Играть" в меню

### Шаг 7.2: Проверьте функционал

- ✅ Загружается главная страница
- ✅ Работает авторизация через Telegram
- ✅ Открываются паки
- ✅ Создаются колоды
- ✅ Запускаются матчи

### Шаг 7.3: Проверьте на мобильном

1. Откройте Telegram на телефоне
2. Найдите бота
3. Запустите игру
4. Проверьте все функции

---

## ЭТАП 8: МОНИТОРИНГ И ЛОГИ

### Railway (Backend)

1. Откройте ваш проект на Railway
2. Перейдите в сервис API
3. Откройте вкладку "Deployments"
4. Нажмите на последний деплой
5. Смотрите логи в реальном времени

### Vercel (Frontend)

1. Откройте проект на Vercel
2. Перейдите в "Deployments"
3. Нажмите на последний деплой
4. Смотрите логи и аналитику

---

## 🐛 РЕШЕНИЕ ПРОБЛЕМ

### Проблема: "Failed to load resource"

**Решение:**
1. Проверьте CORS настройки в `apps/api/src/main.ts`
2. Убедитесь что `NEXT_PUBLIC_API_URL` правильный в Vercel
3. Проверьте что backend запущен на Railway

### Проблема: "Telegram WebApp is not defined"

**Решение:**
1. Убедитесь что скрипт Telegram загружается в `layout.tsx`
2. Проверьте что приложение открывается через Telegram, а не напрямую в браузере

### Проблема: "Database connection failed"

**Решение:**
1. Проверьте что PostgreSQL запущен на Railway
2. Убедитесь что `DATABASE_URL` правильный
3. Проверьте что `pnpm db:push` выполнился при деплое

### Проблема: "WebSocket connection failed"

**Решение:**
1. Убедитесь что Railway сервис поддерживает WebSocket
2. Проверьте что порт 3001 открыт
3. Проверьте настройки Socket.io в `game.gateway.ts`

---

## 📊 ПРОВЕРКА ГОТОВНОСТИ

Перед публикацией убедитесь:

- [ ] Backend деплоится без ошибок на Railway
- [ ] Frontend деплоится без ошибок на Vercel
- [ ] PostgreSQL и Redis работают
- [ ] Домен настроен и работает с HTTPS
- [ ] CORS настроен правильно
- [ ] Telegram бот создан и настроен
- [ ] Web App URL обновлен в BotFather
- [ ] Приложение открывается через Telegram
- [ ] Авторизация работает
- [ ] Все основные функции работают
- [ ] Протестировано на мобильном устройстве

---

## 🎉 ГОТОВО!

Ваша игра теперь доступна в Telegram!

### Как пользователи будут играть:

1. Открывают Telegram
2. Находят вашего бота: `@nexus_cards_bot`
3. Нажимают "Start"
4. Нажимают кнопку "🎮 Играть"
5. Игра открывается прямо в Telegram!

### Следующие шаги:

1. **Добавьте контент:** Создайте больше карт через `prisma/seed-cards.ts`
2. **Настройте аналитику:** Добавьте Google Analytics или Amplitude
3. **Добавьте монетизацию:** Интегрируйте Telegram Stars или Payments
4. **Продвигайте:** Поделитесь ботом в группах и каналах
5. **Собирайте фидбек:** Создайте канал для обратной связи

---

## 📞 ПОДДЕРЖКА

Если что-то не работает:

1. Проверьте логи на Railway и Vercel
2. Убедитесь что все переменные окружения установлены
3. Проверьте что домен работает с HTTPS
4. Убедитесь что база данных заполнена (запустите seed)

---

**Дата создания:** 2026-04-22  
**Версия:** 1.0.0  
**Статус:** ✅ ГОТОВО К ИСПОЛЬЗОВАНИЮ
