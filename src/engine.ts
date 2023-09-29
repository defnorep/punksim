import { State, System } from "./system";

/**
 * Engine is a class around two things:
 *
 * 1. A timed loop.
 * 2. An ordering of system logic.
 */
export class Engine {
  private systems: System[] = [];
  private states: State[] = [];

  constructor(private tickInterval: number = 500) {
    setInterval(this.tick.bind(this), this.tickInterval);
  }

  addSystem(system: System) {
    this.systems.push(system);

    return this;
  }

  getStates() {
    return this.states;
  }

  /**
   * This calls systems, which are the meat and potatoes of the simulation.
   * State starts as an empty array but each system pushes its state result
   * onto it for subsequent system invocations.
   *
   * Order is very important.
   */
  private tick() {
    this.states = this.systems.reduce((states: State[], system) => {
      states.push(system.tick(this.tickInterval, states));

      return states;
    }, []);
  }
}
