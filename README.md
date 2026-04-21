# IT Outsourcing Crossword

Интерактивный кроссворд по дисциплине «ИТ-аутсорсинг и системная интеграция» на базе Next.js, TypeScript, Tailwind CSS и App Router.

## Что внутри
- DDD-структура с разделением на `domains`, `features`, `shared`
- интерактивная сетка кроссворда
- ввод по клеткам
- подсветка активного слова
- проверка ответов
- показ правильных ответов
- очистка пользовательского ввода
- блок терминов по горизонтали и вертикали

## Запуск локально
```bash
pnpm install
pnpm dev
```

Или через npm:
```bash
npm install
npm run dev
```

## Сборка
```bash
pnpm build
pnpm start
```

## Деплой на Vercel
1. Загрузить репозиторий на GitHub.
2. Импортировать проект в Vercel.
3. Framework Preset: Next.js.
4. Build Command и Output Directory можно оставить по умолчанию.

## Архитектура
- `src/app` — маршруты App Router и глобальные стили
- `src/domains/crossword` — доменная модель кроссворда, типы, построение сетки, UI доменного уровня
- `src/features/crossword-play` — игровая логика, hook состояния, интерактивный экран
- `src/shared` — общие утилиты и UI-компоненты
