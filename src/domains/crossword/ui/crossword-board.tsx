"use client";

import { useEffect, useMemo, useRef } from "react";
import type { BuiltCrossword } from "@/domains/crossword/lib/build-grid";
import type { CrosswordCell, CrosswordData } from "@/domains/crossword/model/types";
import { cn } from "@/shared/lib/cn";

type StatusMap = Record<string, "idle" | "correct" | "wrong" | "revealed">;
type ValueMap = Record<string, string>;

interface CrosswordBoardProps {
    data: CrosswordData;
    built: BuiltCrossword;
    values: ValueMap;
    statuses: StatusMap;
    selectedEntryId: number | null;
    onSelectEntry: (entryId: number | null) => void;
    onChangeCell: (cell: CrosswordCell, value: string) => void;
}

function keyOf(cell: CrosswordCell) {
    return `${cell.row}:${cell.col}`;
}

export function CrosswordBoard({
                                   built,
                                   values,
                                   statuses,
                                   selectedEntryId,
                                   onSelectEntry,
                                   onChangeCell,
                               }: CrosswordBoardProps) {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const selectedCells = useMemo(() => {
        if (selectedEntryId === null) {
            return [];
        }

        return built.cells
            .filter((cell) => cell.entries.includes(selectedEntryId))
            .sort((a, b) => {
                if (a.row !== b.row) return a.row - b.row;
                return a.col - b.col;
            });
    }, [built.cells, selectedEntryId]);

    useEffect(() => {
        if (!selectedCells.length) return;

        const firstCell = selectedCells[0];
        const key = keyOf(firstCell);
        const input = inputRefs.current[key];

        if (input) {
            input.focus();
            input.select();
            input.scrollIntoView({
                block: "nearest",
                inline: "nearest",
            });
        }
    }, [selectedCells]);

    const moveFocus = (currentCell: CrosswordCell, direction: "next" | "prev") => {
        if (selectedEntryId === null) return;

        const cells = selectedCells;
        const currentIndex = cells.findIndex(
            (cell) => cell.row === currentCell.row && cell.col === currentCell.col,
        );

        if (currentIndex === -1) return;

        const nextIndex =
            direction === "next" ? currentIndex + 1 : currentIndex - 1;

        if (nextIndex < 0 || nextIndex >= cells.length) return;

        const nextCell = cells[nextIndex];
        const nextInput = inputRefs.current[keyOf(nextCell)];
        nextInput?.focus();
        nextInput?.select();
    };

    return (
        <div className="overflow-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div
                className="grid gap-[2px] rounded-2xl bg-slate-200 p-[2px]"
                style={{
                    gridTemplateColumns: `repeat(${built.cols}, minmax(0, 42px))`,
                    width: "max-content",
                    margin: "0 auto",
                }}
            >
                {built.matrix.flatMap((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        if (!cell) {
                            return (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className="h-[42px] w-[42px] rounded-sm bg-slate-800"
                                />
                            );
                        }

                        const key = keyOf(cell);
                        const status = statuses[key] ?? "idle";
                        const isActive =
                            selectedEntryId !== null && cell.entries.includes(selectedEntryId);

                        return (
                            <label
                                key={key}
                                className={cn(
                                    "relative flex h-[42px] w-[42px] items-center justify-center rounded-sm border text-center transition-colors",
                                    "border-slate-300 bg-white",
                                    isActive && "border-indigo-600 bg-indigo-100 ring-2 ring-indigo-300",
                                    status === "correct" && "border-emerald-500 bg-emerald-100",
                                    status === "wrong" && "border-rose-500 bg-rose-100",
                                    status === "revealed" && "border-amber-500 bg-amber-100",
                                )}
                            >
                                {cell.number ? (
                                    <span className="absolute left-1 top-0.5 text-[10px] font-medium text-slate-500">
                    {cell.number}
                  </span>
                                ) : null}
                                <input
                                    ref={(el) => {
                                        inputRefs.current[key] = el;
                                    }}
                                    value={values[key] ?? ""}
                                    onFocus={() => {
                                        if (selectedEntryId === null) {
                                            onSelectEntry(cell.entries[0] ?? null);
                                        }
                                    }}
                                    onClick={() => onSelectEntry(cell.entries[0] ?? null)}
                                    onChange={(event) => {
                                        onChangeCell(cell, event.target.value);

                                        const nextValue = event.target.value
                                            .toUpperCase()
                                            .replace(/[^А-ЯЁ]/g, "")
                                            .slice(0, 1);

                                        if (nextValue) {
                                            requestAnimationFrame(() => moveFocus(cell, "next"));
                                        }
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                                            event.preventDefault();
                                            moveFocus(cell, "next");
                                        }

                                        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                                            event.preventDefault();
                                            moveFocus(cell, "prev");
                                        }

                                        if (event.key === "Backspace" && !(values[key] ?? "")) {
                                            event.preventDefault();
                                            moveFocus(cell, "prev");
                                        }
                                    }}
                                    maxLength={1}
                                    autoComplete="off"
                                    className="h-full w-full rounded-sm bg-transparent text-center text-lg font-bold uppercase text-slate-900 caret-indigo-600"
                                    aria-label={`Ячейка ${key}`}
                                />
                            </label>
                        );
                    }),
                )}
            </div>
        </div>
    );
}