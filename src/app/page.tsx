import { CrosswordGame } from "@/features/crossword-play/ui/crossword-game";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">
            Next.js · TypeScript · Tailwind · DDD
          </p>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Интерактивный кроссворд по ИТ-аутсорсингу
          </h1>
          <p className="max-w-4xl text-base leading-7 text-slate-600">
            Приложение построено на терминологии лабораторных работ по ИТ-аутсорсингу,
            SLA, CRM, сорсингу, методике перехода к аутсорсингу и сервисному управлению.
            Пользователь может заполнять сетку, проверять ответы, смотреть правильное
            решение и визуально анализировать пересечения терминов.
          </p>
        </header>

        <CrosswordGame />
      </div>
    </main>
  );
}
