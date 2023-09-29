import { State } from "../system";
import { System } from "../system";

export interface WorldTimeState {
  kind: "worldtime";
  time: Date;
}

export class WorldTimeSystem implements System {
  private local = { time: new Date() };

  constructor(date: Date) {
    this.local.time = date;
  }

  tick(delta: number, _global: State[]): WorldTimeState {
    this.local.time.setTime(this.local.time.getTime() + delta);

    return {
      kind: "worldtime",
      time: this.local.time,
    };
  }
}
