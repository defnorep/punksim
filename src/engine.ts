import { State } from "./state";
import { System } from "./system";

export interface TimeOptions {
  initialTime: number;
  rate: number;
}

const defaultTimeOptions = (): TimeOptions => ({
  initialTime: Date.now(),
  rate: 500, // milliseconds
});

/**
 * Sim is a class around three things:
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
   *
   * We might want to add a plugin system later but direct function calls are easy to see and understand.
   */
  private tick() {
    /**
     * Calculate time.
     *
     * Time is maintained as a unix epoch, in milliseconds.
     * The initial time as well as the rate of time can be set in TimeOptions.
     *
     * The rate of time is a multiplier. If the tick interval is 500 ms and the multiplier is 1.0,
     * then the amount of time that has passed since the last tick is 500 ms. If the multiplier
     * is 2.0, then the amount of time will be 1000 ms. This lets us speed up and slow down time,
     * either for system mechanics, or to simulate things more quickly than in real time.
     *
     * Since time is closely related to the tick interval, and time deltas (time since last tick)
     * are crucial for systems to run, it makes sense to keep time as an Engine concern for now.
     */
    const timeBeforeTick = this.time;
    const timeAfterTick = this.time + this.timeOptions.rate;
    const delta = timeAfterTick - timeBeforeTick;

    /**
     * Now that we have the time delta, we can run systems.
     */
    this.systems.forEach((system) => {
      system(delta, this.state);
    });

    this.time = timeAfterTick;
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
