"use client";

import { CluesList } from "@/domains/crossword/ui/clues-list";
import { CrosswordBoard } from "@/domains/crossword/ui/crossword-board";
import { useCrosswordGame } from "@/features/crossword-play/model/use-crossword-game";
import { Button } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";

export function CrosswordGame() {
  const game = useCrosswordGame();

  return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,820px)_minmax(320px,1fr)]">
        <div className="flex flex-col gap-6">
          <Panel>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-slate-900">
                  {game.data.title}
                </h2>
                <p className="max-w-3xl text-sm leading-6 text-slate-600">
                  {game.data.subtitle}
                </p>
              </div>
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-slate-700">
                <div className="font-medium text-indigo-700">Прогресс заполнения</div>
                <div>
                  {game.filledCells} из {game.totalCells} клеток · {game.progress}%
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-3 no-print">
              <Button variant="primary" onClick={game.check}>
                Проверить
              </Button>
              <Button onClick={game.reveal}>Показать ответы</Button>
              <Button variant="danger" onClick={game.reset}>
                Очистить
              </Button>
            </div>

            {game.checkResult.checked && !game.solved ? (
                <div className="mb-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                  Найдены ошибки. Верных клеток: {game.checkResult.correctCount}, неверных:{" "}
                  {game.checkResult.wrongCount}.
                </div>
            ) : null}

            {game.solved ? (
                <div className="mb-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  Кроссворд решён верно.
                </div>
            ) : null}

            <CrosswordBoard
                data={game.data}
                built={game.built}
                values={game.values}
                statuses={game.statuses}
                selectedEntryId={game.selectedEntryId}
                onSelectEntry={game.setSelectedEntryId}
                onChangeCell={game.onChangeCell}
            />
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel>
            <div className="mb-4">
              <h2 className="mb-2 text-xl font-bold text-slate-900">Подсказки</h2>
              <p className="text-sm leading-6 text-slate-600">
                Нажми на определение, чтобы выделить связанное слово в сетке.
              </p>
            </div>

            <CluesList
                data={game.data}
                selectedEntryId={game.selectedEntryId}
                onSelectEntry={game.setSelectedEntryId}
            />
          </Panel>
        </div>
      </div>
  );
}