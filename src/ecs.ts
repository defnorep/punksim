import { randomBytes } from "crypto";

export type Entity = string;

export abstract class Component {}

type ComponentClass<T extends Component> = new (...args: any[]) => T;

export class ComponentContainer {
  private map = new Map<Function, Component>();

  public add(component: Component): void {
    this.map.set(component.constructor, component);
  }

  public get<T extends Component>(componentClass: ComponentClass<T>): T {
    return this.map.get(componentClass) as T;
  }

  public has(componentClass: Function): boolean {
    return this.map.has(componentClass);
  }

  public hasAll(componentClasses: Iterable<Function>): boolean {
    for (let cls of componentClasses) {
      if (!this.map.has(cls)) {
        return false;
      }
    }
    return true;
  }

  public delete(componentClass: Function): void {
    this.map.delete(componentClass);
  }
}

export abstract class System {
  constructor(protected ecs: Ecs) {}
  abstract update(delta: number, entities: Entity[]): void;
}

export class Ecs {
  private entities: Map<Entity, ComponentContainer> = new Map();
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

  getEntities(): Entity[] {
    return [...this.entities.keys()];
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
