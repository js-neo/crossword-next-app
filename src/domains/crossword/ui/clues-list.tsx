"use client";

import type { CrosswordData, Direction } from "@/domains/crossword/model/types";
import { cn } from "@/shared/lib/cn";

interface CluesListProps {
  data: CrosswordData;
  selectedEntryId: number | null;
  onSelectEntry: (entryId: number) => void;
}

export function CluesList({
                            data,
                            selectedEntryId,
                            onSelectEntry,
                          }: CluesListProps) {
  const renderGroup = (direction: Direction, title: string) => {
    const entries = data.entries
        .filter((entry) => entry.direction === direction)
        .sort((a, b) => a.id - b.id);

    return (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <div className="flex flex-col gap-2">
            {entries.map((entry) => (
                <button
                    type="button"
                    key={entry.id}
                    onClick={() => onSelectEntry(entry.id)}
                    className={cn(
                        "rounded-2xl border px-3 py-3 text-left transition-colors",
                        selectedEntryId === entry.id
                            ? "border-indigo-500 bg-indigo-50 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50",
                    )}
                >
                  <div className="mb-1 text-sm font-semibold text-indigo-700">
                    {entry.id}. {entry.direction === "across" ? "По горизонтали" : "По вертикали"}
                  </div>
                  <div className="text-sm leading-6 text-slate-700">{entry.clue}</div>
                </button>
            ))}
          </div>
        </div>
    );
  };

  return (
      <div className="grid gap-6 xl:grid-cols-2">
        {renderGroup("across", "По горизонтали")}
        {renderGroup("down", "По вертикали")}
      </div>
  );
}