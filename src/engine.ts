import { State } from "./system";
import { System } from "./system";

/**
 * Engine is a class around three things:
 *
 * 1. A timed loop.
 * 2. An ordering of system logic.
 * 3. A callback for external I/O.
 */
export class Engine {
  private systems: System[] = [];

  constructor(
    private states: State[] = [],
    private updateCallback: (global: any) => void,
    private tickInterval: number = 500,
  ) {
    setInterval(this.tick.bind(this), this.tickInterval);
  }

  addSystem(system: System) {
    this.systems.push(system);

    return this;
  }

  /**
   * This calls systems, which are the meat and potatoes of the simulation.
   *
   * Order is very important.
   */
  private tick() {
    this.states = this.systems.reduce((states: State[], system) => {
      states.push(system.tick(this.tickInterval, states));

      return states;
    }, []);

    /**
     * Allow arbitrary behaviour like I/O.
     *
     * The callback in index.tsx is the websocket invocation,
     * which will now slow down the next tick. This might need
     * to change.
     */
    this.updateCallback(this.states);
  }
}
