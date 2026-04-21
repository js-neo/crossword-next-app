"use client";

import { useMemo, useState } from "react";
import { buildCrosswordGrid } from "@/domains/crossword/lib/build-grid";
import { crosswordData } from "@/domains/crossword/model/crossword";
import type { CrosswordCell } from "@/domains/crossword/model/types";

type StatusMap = Record<string, "idle" | "correct" | "wrong" | "revealed">;
type ValueMap = Record<string, string>;

function keyOf(cell: CrosswordCell) {
  return `${cell.row}:${cell.col}`;
}

export function useCrosswordGame() {
  const built = useMemo(() => buildCrosswordGrid(crosswordData), []);
  const [values, setValues] = useState<ValueMap>({});
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  const totalCells = built.cells.length;
  const filledCells = built.cells.filter((cell) => {
    const value = values[keyOf(cell)];
    return Boolean(value);
  }).length;

  const progress = Math.round((filledCells / totalCells) * 100);

  const onChangeCell = (cell: CrosswordCell, rawValue: string) => {
    const nextValue = rawValue.toUpperCase().replace(/[^А-ЯЁ]/g, "").slice(0, 1);
    const key = keyOf(cell);

    setValues((prev) => ({
      ...prev,
      [key]: nextValue,
    }));

    setStatuses((prev) => ({
      ...prev,
      [key]: "idle",
    }));
  };

  const reset = () => {
    setValues({});
    setStatuses({});
    setSelectedEntryId(null);
  };

  const reveal = () => {
    const nextValues: ValueMap = {};
    const nextStatuses: StatusMap = {};

    for (const cell of built.cells) {
      const key = keyOf(cell);
      nextValues[key] = cell.solution;
      nextStatuses[key] = "revealed";
    }

    setValues(nextValues);
    setStatuses(nextStatuses);
  };

  const check = () => {
    const nextStatuses: StatusMap = {};

    for (const cell of built.cells) {
      const key = keyOf(cell);
      const current = (values[key] ?? "").toUpperCase();
      if (!current) {
        nextStatuses[key] = "wrong";
      } else if (current === cell.solution) {
        nextStatuses[key] = "correct";
      } else {
        nextStatuses[key] = "wrong";
      }
    }

    setStatuses(nextStatuses);
  };

  const solved = built.cells.every((cell) => {
    const key = keyOf(cell);
    return (values[key] ?? "").toUpperCase() === cell.solution;
  });

  return {
    data: crosswordData,
    built,
    values,
    statuses,
    selectedEntryId,
    setSelectedEntryId,
    onChangeCell,
    progress,
    filledCells,
    totalCells,
    solved,
    reset,
    reveal,
    check,
  };
}
