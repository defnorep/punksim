import { State } from "./state";

export type System = (delta: number, state: State) => void;
