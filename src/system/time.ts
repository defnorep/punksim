import { Ecs, Entity, System } from "../ecs";

export interface FlowingTime {
  kind: "flowingtime";
  datetime: Date;
  rate: number;
}

export class StartupTimeSystem extends System {
  components = ["flowingtime"];

  constructor(
    ecs: Ecs,
    private datetime: Date,
    private rate = 1.0,
  ) {
    super(ecs);
  }

  update(delta: number, entities: Entity[]): void {
    const time = {
      kind: "flowingtime",
      datetime: this.datetime,
      rate: this.rate,
    };

    this.ecs.createEntity([time]);
  }
}

export class TimeSystem extends System {
  components = ["flowingtime"];

  constructor(ecs: Ecs) {
    super(ecs);
  }

  update(delta: number, entities: Entity[]): void {
    const entity = entities.at(0);

    if (entity) {
      const time = this.ecs
        .getComponents(entity)
        .find(
          (component): component is FlowingTime =>
            component.kind === "flowingtime",
        );

      if (time) {
        time.datetime.setTime(time.datetime.getTime() + delta * time.rate);
      }
    }
  }
}
