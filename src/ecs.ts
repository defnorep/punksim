import { randomBytes } from "crypto";

export type Entity = string;

export type EntityComponents = Component[][];

export type Component = { kind: string };

export abstract class System {
  abstract readonly components: string[];
  constructor(protected ecs: Ecs) {}
  abstract update(delta: number, entities: EntityComponents): void;
}

export class Ecs {
  private entities: Map<Entity, Component[]> = new Map();
  private systems: System[] = [];

  createEntity(components: Component[]): Entity {
    const entity = randomBytes(8).toString("hex");

    this.entities.set(entity, components);

    return entity;
  }

  destroyEntity(entity: Entity): void {
    this.entities.delete(entity);
  }

  getEntities(): Entity[] {
    return [...this.entities.keys()];
  }

  addComponents(entity: Entity, components: Component[]): void {
    const currentComponents = this.entities.get(entity) ?? [];

    this.entities.set(entity, [...currentComponents, ...components]);
  }

  getComponents(entity: Entity): Component[] {
    return this.entities.get(entity) ?? [];
  }

  addSystem(system: System): void {
    this.systems.push(system);
  }

  update(delta: number) {
    this.systems.forEach((system) => {
      const entities = this.getEntities()
        .map((entity) => this.getComponents(entity))
        .filter((components) =>
          components.some((component) =>
            system.components.includes(component.kind),
          ),
        );

      system.update(delta, entities);
    });
  }
}
