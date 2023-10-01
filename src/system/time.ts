import { Ecs, Entity, System } from "../ecs";

export interface FlowingTime {
  kind: "time";
  datetime: Date;
  rate: number;
}

export class TimeSystem extends System {
  private entity: Entity;

  constructor(
    ecs: Ecs,
    private datetime: Date,
    private rate = 1.0,
  ) {
    super(ecs);
    const time = {
      kind: "time",
      datetime: this.datetime,
      rate: this.rate,
    };

    this.entity = ecs.createEntity([time]);
  }

  update(delta: number, _entities: string[]): void {
    const time = this.ecs
      // should caching an entity be illegal? :thinking_face:
      .getComponents(this.entity)
      .find((component): component is FlowingTime => component.kind === "time");

    if (time) {
      time.datetime.setTime(time.datetime.getTime() + delta * time.rate);
    }
  }
}
