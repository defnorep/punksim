import { State, System } from "../system";

export interface TimeState {
  kind: "time";
  datetime: Date;
  rate: number;
}

export class TimeSystem implements System {
  private local: { datetime: Date; rate: number };

  constructor(datetime: Date, rate = 1.0) {
    this.local = {
      datetime,
      rate,
    };
  }

  tick(delta: number, _global: State[]): TimeState {
    this.local.datetime.setTime(
      this.local.datetime.getTime() + delta * this.local.rate,
    );

    return {
      kind: "time",
      datetime: this.local.datetime,
      rate: this.local.rate,
    };
  }
}
