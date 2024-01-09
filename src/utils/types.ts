import { GameStates } from "./constants";

export type SelectOptions = {
  value: string | number | null;
  text: string;
};

export type CellCoordinates = {
  row: number;
  column: number;
};

export type SwitchDirection = "forward" | "backward";

export type GameState = keyof typeof GameStates;
