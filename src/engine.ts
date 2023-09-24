import { State } from "./state";
import { System } from "./system";

export interface TimeOptions {
  initialTime: number;
  rate: number;
}

export interface Time {
  time: number;
  delta: number;
}

const defaultTimeOptions = (): TimeOptions => ({
  initialTime: Date.now(),
  rate: 500, // milliseconds
});

/**
 * Engine is a class around three things:
 *
 * 1. A timed loop.
 * 2. An ordering of system logic.
 * 3. A callback for external I/O.
 */
export class Engine {
  private time: number;

  constructor(
    private state: State = State.empty(),
    private systems: System[] = [],
    private tickCallback: (state: State) => void,
    private tickInterval: number = 500,
    private timeOptions: TimeOptions = defaultTimeOptions(),
  ) {
    this.time = timeOptions.initialTime;
    setInterval(this.tick.bind(this), this.tickInterval);
  }

  /**
   * This calls systems, which are the meat and potatoes of the simulation.
   *
   * Order is important.
   */
  private tick() {
    /**
     * Calculate time.
     *
     * Time is maintained as a unix epoch, in milliseconds.
     * The initial time as well as the rate of time can be set in TimeOptions.
     *
     * The rate of time is decoupled from the tick interval. This lets us manipulate time for
     * game mechanics, or to simply run the simulation a lot faster.
     *
     * Since time is closely related to the tick interval, and time deltas (time since last tick)
     * are crucial for systems to run, it makes sense to keep time as an Engine concern for now.
     */
    const tickTime = this.time + this.timeOptions.rate;
    const delta = tickTime - this.time;

    /**
     * Now that we have the time delta, we can run systems.
     */
    this.systems.forEach((system) => {
      system(delta, this.state);
    });

    this.time = tickTime;

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
