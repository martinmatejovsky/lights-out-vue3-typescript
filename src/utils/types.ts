import { GameStates } from "./constants";

type SelectOptions = {
  value: string | number | null;
  text: string;
};

type CellCoordinates = {
  row: number;
  column: number;
};

type SwitchDirection = "forward" | "backward";

type GameState = keyof typeof GameStates;

export { SelectOptions, CellCoordinates, SwitchDirection, GameState };
