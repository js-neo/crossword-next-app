export type Direction = "across" | "down";

export interface CrosswordEntry {
  id: number;
  answer: string;
  clue: string;
  direction: Direction;
  row: number;
  col: number;
}

export interface CrosswordCell {
  row: number;
  col: number;
  solution: string;
  entries: number[];
  number?: number;
}

export interface CrosswordData {
  title: string;
  subtitle: string;
  entries: CrosswordEntry[];
}
