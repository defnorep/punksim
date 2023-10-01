import { Ecs, Entity, System } from "../ecs";

export interface FlowingTime {
  kind: "flowingtime";
  datetime: Date;
  rate: number;
}

export class TimeSystem extends System {
  components = ["flowingtime"];
  private entity: Entity;

  constructor(
    ecs: Ecs,
    private datetime: Date,
    private rate = 1.0,
  ) {
    super(ecs);
    const time = {
      kind: "flowingtime",
      datetime: this.datetime,
      rate: this.rate,
    };

    this.entity = ecs.createEntity([time]);
  }

  update(delta: number, entities: FlowingTime[][]): void {
    const time = entities
      .at(0)
      ?.find(
        (component): component is FlowingTime =>
          component.kind === "flowingtime",
      );

    if (time) {
      time.datetime.setTime(time.datetime.getTime() + delta * time.rate);
    }
  }
}
