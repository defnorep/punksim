import { ComponentContainer } from "./ComponentContainer";
import { Entity } from "./ecs";

export class EntityContainer {
  constructor(protected map: Map<Entity, ComponentContainer> = new Map()) {}

  public allOf(...componentClasses: Function[]): NarrowedEntityContainer {
    const entities = new NarrowedEntityContainer();

    for (const [entity, components] of this.map) {
      if (components.hasAll(...componentClasses)) {
        entities.map.set(entity, components);
      }
    }

    return entities;
  }

  public noneOf(...componentClasses: Function[]): NarrowedEntityContainer {
    const entities = new NarrowedEntityContainer();

    for (const [entity, components] of this.map) {
      if (!components.hasAll(...componentClasses)) {
        entities.map.set(entity, components);
      }
    }

    return entities;
  }
}

class NarrowedEntityContainer extends EntityContainer {
  public empty() {
    return this.map.size === 0;
  }

  public results(): [Entity, ComponentContainer][] {
    return Array.from(this.map.entries());
  }

  public ids(): Entity[] {
    return Array.from(this.map.keys());
  }
}
