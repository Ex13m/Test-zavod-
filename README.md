# 🎣 Контент-Завод · lure-content-factory

Фабрика продающих постов для рыболовных приманок. Загружаете фото приманки —
завод собирает пост-воронку (крючок → выгоды → доказательство → CTA на ваш сайт),
хранит историю и рассылает по каналам: Telegram + любая система автопостинга по вебхуку.

**Стек:** Vite 5 · React 18 · Zustand · IndexedDB (idb-keyval) · Canvas 2D · Netlify Functions.
Полностью статический SPA, все данные — локально в браузере.

## Быстрый старт

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # прод-сборка в dist/
npm run preview    # локальный просмотр сборки
```

## Деплой на Netlify (делается вручную)

Репозиторий уже содержит `netlify.toml` (build: `npm run build`, publish: `dist`,
SPA-redirect) и serverless-функцию `netlify/functions/telegram-post.mjs`.

1. Netlify → **Add new site → Import from Git** → выбрать этот репозиторий и ветку.
2. Настройки подхватятся из `netlify.toml`, ничего править не нужно.
3. После деплоя функция Telegram доступна по `/.netlify/functions/telegram-post`.

> ⚠️ Публикация в Telegram работает **только на деплое** (локально функция недоступна,
> т.к. `api.telegram.org` не отдаёт CORS браузеру).

## Подключение Telegram

1. Создайте бота у [@BotFather](https://t.me/BotFather), скопируйте токен.
2. Добавьте бота **администратором** в ваш канал.
3. Дашборд → «Дистрибуция» → вставьте токен и ID канала (`@имя_канала` или `-100…`).
   Токен хранится только в вашем браузере.

## Подключение автопостинга (n8n / Make / Zapier / Albato)

1. Создайте сценарий с триггером **Webhook** и скопируйте его URL.
2. Дашборд → «Дистрибуция» → выберите сервис, вставьте URL.
3. Завод шлёт JSON: `{ source, version, title, text, meta, photoDataUrl?, createdAt }` —
   дальше сценарий раскладывает пост по соцсетям.

## Структура проекта

```
src/
  engine/          # мозг завода
    lureTypes.js       # база знаний: 8 типов приманок (рыба, боли, выгоды, лексика)
    generator.js       # сборка постов: формулы AIDA/PAS/Story/Expert/FOMO × тон × стиль
    styleAnalyzer.js   # эвристика копирования стиля по скринам (v1)
    distribution.js    # выходы: Telegram-прокси, вебхук автопостинга
    imageUtil.js       # сжатие загружаемых фото
  art.js           # реестр арта Higgsfield: цепочки источников (см. раздел ниже)
  components/      # FishCanvas (подводная сцена), Dropzone, hooks
  views/           # Пульт · Приманки · Конвейер · Стиль · История · Дистрибуция · Настройки
  store.js         # zustand + persist; картинки в IndexedDB
netlify/functions/ # telegram-post.mjs — CORS-прокси к Bot API
docs/              # SPEC.md · ROADMAP.md
```

## Арт из Higgsfield

Весь фирменный арт (подводный фон, Капитан Окунь, силуэты 5 рыб,
светящаяся приманка) сгенерирован в [Higgsfield](https://higgsfield.ai):
фон — Soul Location, Капитан — Nano Banana, силуэты — Recraft V4.1 vector.
Фон у Капитана и силуэтов **вырезан ремувером Higgsfield** — это
прозрачные PNG-стикеры, они ложатся на любую тему без blend-хаков.

Каждая картинка в `src/art.js` — цепочка источников, компонент
`SmartImg` перебирает её по `onError`:

1. локальный файл `public/art/<имя>` (в репозитории его нет);
2. прозрачный PNG на CDN Higgsfield;
3. встроенный SVG-фолбэк (рисованный Капитан, векторные силуэты)
   или градиенты — приложение работает даже полностью офлайн.

Чтобы не зависеть от CDN, скачайте файлы по ссылкам из `src/art.js`
в `public/art/` под именами из первого источника (`captain.png`,
`sil-pike.png`, `sil-perch.png`, `sil-zander.png`, `sil-asp.png`,
`sil-trout.png`, `bg.jpg`, `lure-glow.png`) — локальная копия
подхватится сама, первым приоритетом.

## Документация

- [Спецификация (spec-pilot)](docs/SPEC.md)
- [Дорожная карта](docs/ROADMAP.md)
- [История изменений](CHANGELOG.md)
