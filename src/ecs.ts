import { randomBytes } from "crypto";
import { ComponentContainer } from "./ecs/componentContainer";
import { EntityContainer } from "./ecs/entityContainer";

export type Entity = string;

export abstract class Component {}

export type ComponentClass<T extends Component> = new (...args: any[]) => T;

export abstract class System {
  constructor(protected ecs: Ecs) {}
  abstract update(delta: number, entities: EntityContainer): void;
}

export class Ecs {
  private entities: Map<Entity, ComponentContainer> = new Map();
  private singletons: ComponentContainer = new ComponentContainer();
  private startupSystems: System[] = [];
  private systems: System[] = [];

  createEntity(...components: Component[]): Entity {
    const entity = randomBytes(8).toString("hex");
    const container = new ComponentContainer();

    for (const component of components) {
      container.add(component);
    }

    this.entities.set(entity, container);

    return entity;
  }
  destroyEntity(entity: Entity): void {
    this.entities.delete(entity);
  }

  getEntities(): EntityContainer {
    return new EntityContainer(this.entities);
  }

  createSingleton(component: Component) {
    this.singletons.add(component);
  }

  getSingleton<T extends Component>(component: ComponentClass<T>) {
    return this.singletons.get(component);
  }

  addComponents(entity: Entity, components: Component[]): void {
    for (const component of components) {
      this.entities.get(entity)?.add(component);
    }
  }

  removeComponents(entity: Entity, componentClasses: Function[]): void {
    for (const componentClass of componentClasses) {
      this.entities.get(entity)?.delete(componentClass);
    }
  }

  getComponents(entity: Entity): ComponentContainer {
    return this.entities.get(entity) ?? new ComponentContainer();
  }

  addSystem(system: System): Ecs {
    this.systems.push(system);

    return this;
  }

  addStartupSystem(system: System): Ecs {
    this.startupSystems.push(system);

    return this;
  }

  startup() {
    this.startupSystems.forEach((system) => {
      system.update(0, this.getEntities());
    });
  }

  update(delta: number) {
    this.systems.forEach((system) => {
      system.update(delta, this.getEntities());
    });
  }
}
