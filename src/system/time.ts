import { State } from "../system";
import { System } from "../system";

export interface TimeState {
  kind: "time";
  time: Date;
  rate: number;
}

export class TimeSystem implements System {
  private local: { time: Date; rate: number };

  constructor(time: Date, rate = 1.0) {
    this.local = {
      time: time,
      rate,
    };
  }

  tick(delta: number, _global: State[]): TimeState {
    this.local.time.setTime(
      this.local.time.getTime() + delta * this.local.rate,
    );

    return {
      kind: "time",
      time: this.local.time,
      rate: this.local.rate,
    };
  }
}
