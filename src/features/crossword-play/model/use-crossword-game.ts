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
  const [checkResult, setCheckResult] = useState<{
    checked: boolean;
    correctCount: number;
    wrongCount: number;
  }>({
    checked: false,
    correctCount: 0,
    wrongCount: 0,
  });

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

    setCheckResult({
      checked: false,
      correctCount: 0,
      wrongCount: 0,
    });
  };

  const reset = () => {
    setValues({});
    setStatuses({});
    setSelectedEntryId(null);
    setCheckResult({
      checked: false,
      correctCount: 0,
      wrongCount: 0,
    });
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
    setCheckResult({
      checked: true,
      correctCount: built.cells.length,
      wrongCount: 0,
    });
  };

  const check = () => {
    const nextStatuses: StatusMap = {};
    let correctCount = 0;
    let wrongCount = 0;

    for (const cell of built.cells) {
      const key = keyOf(cell);
      const current = (values[key] ?? "").toUpperCase();

      if (current && current === cell.solution) {
        nextStatuses[key] = "correct";
        correctCount += 1;
      } else {
        nextStatuses[key] = "wrong";
        wrongCount += 1;
      }
    }

    setStatuses(nextStatuses);
    setCheckResult({
      checked: true,
      correctCount,
      wrongCount,
    });
  };

  const solved =
      checkResult.checked &&
      checkResult.wrongCount === 0 &&
      checkResult.correctCount === built.cells.length;

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
    checkResult,
  };
}