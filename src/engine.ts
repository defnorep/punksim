import { State } from "./state";
import { System } from "./system";

/**
 * Engine is a class around three things:
 *
 * 1. A timed loop.
 * 2. An ordering of system logic.
 * 3. A callback for external I/O.
 */
export class Engine {
  private systems: System<State>[] = [];

  constructor(
    private state: State[] = [],
    private updateCallback: (global: any) => void,
    private tickInterval: number = 500,
  ) {
    setInterval(this.tick.bind(this), this.tickInterval);
  }

  addSystem(system: System<State>) {
    this.systems.push(system);

    return this;
  }

  onUpdate(callback: (global: Map<any, any>) => void) {
    this.updateCallback = callback;

    return this;
  }

  /**
   * This calls systems, which are the meat and potatoes of the simulation.
   *
   * Order is important.
   */
  private tick() {
    this.state = this.systems.map((sys) => {
      return sys.tick(this.tickInterval, this.state);
    });

    /**
     * Allow arbitrary behaviour like I/O.
     * This might slow down tick speed if really slow I/O is being done.
     *
     * In our app, this callback is generally calling postMessage in a worker,
     * which can be slow due to copying data between thread boundaries.
     */
    this.updateCallback(this.state);
  }
}
