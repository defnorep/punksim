import { State } from "./state";

/**
 * Sim is a class around three things:
 *
 * 1. A timed loop.
 * 2. An ordering of system logic.
 * 3. A callback for external I/O.
 */
export class Engine {
  constructor(
    private state: State = State.empty(),
    private tickCallback: (state: State) => void,
    private tickInterval: number = 500,
  ) {
    setInterval(this.tick.bind(this), this.tickInterval);
  }

  /**
   * This calls systems, which are the meat and potatoes of the simulation.
   *
   * Order is important.
   *
   * We might want to add a plugin system later but direct function calls are easy to see and understand.
   */
  private tick() {
    /**
     * Allow arbitrary behaviour like I/O.
     * This might slow down tick speed if really slow I/O is being done.
     *
     * In our app, this callback is generally calling postMessage in a worker,
     * which can be slow due to copying data between thread boundaries.
     */
    this.tickCallback(this.state);
  }
}
