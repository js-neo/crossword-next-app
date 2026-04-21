import type { CrosswordCell, CrosswordData } from "@/domains/crossword/model/types";

export interface BuiltCrossword {
  cells: CrosswordCell[];
  rows: number;
  cols: number;
  matrix: Array<Array<CrosswordCell | null>>;
}

export function buildCrosswordGrid(data: CrosswordData): BuiltCrossword {
  const cellMap = new Map<string, CrosswordCell>();

  for (const entry of data.entries) {
    [...entry.answer].forEach((char, index) => {
      const row = entry.direction === "across" ? entry.row : entry.row + index;
      const col = entry.direction === "across" ? entry.col + index : entry.col;
      const key = `${row}:${col}`;
      const existing = cellMap.get(key);

      if (existing) {
        if (existing.solution !== char) {
          throw new Error(
            `Конфликт в сетке: ${entry.answer} не совпадает по букве в ячейке ${key}.`,
          );
        }

        existing.entries.push(entry.id);
        if (index === 0 && existing.number === undefined) {
          existing.number = entry.id;
        }
      } else {
        cellMap.set(key, {
          row,
          col,
          solution: char,
          entries: [entry.id],
          number: index === 0 ? entry.id : undefined,
        });
      }
    });
  }

  const cells = [...cellMap.values()];
  const minRow = Math.min(...cells.map((cell) => cell.row));
  const maxRow = Math.max(...cells.map((cell) => cell.row));
  const minCol = Math.min(...cells.map((cell) => cell.col));
  const maxCol = Math.max(...cells.map((cell) => cell.col));

  const normalized = cells.map((cell) => ({
    ...cell,
    row: cell.row - minRow,
    col: cell.col - minCol,
  }));

  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;
  const matrix: Array<Array<CrosswordCell | null>> = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null),
  );

  for (const cell of normalized) {
    matrix[cell.row][cell.col] = cell;
  }

  return {
    cells: normalized,
    rows,
    cols,
    matrix,
  };
}
