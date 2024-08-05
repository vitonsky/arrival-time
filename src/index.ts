export type TimeFetcher = () => number;

export type Measurements = {
	/**
	 * Time delta between start time and current time
	 */
	timeDelta: number;
	/**
	 * Average time per one progress step
	 */
	averageTime: number;
	/**
	 * Left progress
	 */
	progressLeft: number;
	/**
	 * Progression per `tick` (default 1000ms)
	 */
	speed: number;
	/**
	 * Estimated time in ms until complete
	 */
	estimate: number;
};

// Fallback to `Date` for node 14
export const defaultClock = () =>
	typeof performance !== 'undefined' ? performance.now() : new Date().getTime();

export class Estimation {
	private readonly timeFetcher;
	private readonly state;
	constructor({
		progress = 0,
		total = 100,
		startTime,
		timeFetcher,
	}: {
		progress?: number;
		total?: number;
		startTime?: number;
		timeFetcher?: TimeFetcher;
	} = {}) {
		this.timeFetcher = timeFetcher ?? defaultClock;

		this.state = {
			progress,
			total,
			startTime: startTime ?? this.now(),
		};
	}

	public reset(time?: number) {
		this.state.startTime = time !== undefined ? time : this.now();
	}

	public update(progress: number, total?: number) {
		this.state.progress = progress;

		if (total !== undefined) {
			this.state.total = total;
		}

		return this.measure();
	}

	public estimate() {
		return this.measure().estimate;
	}

	public measure(tick = 1000): Measurements {
		const { progress, total } = this.state;

		const timeDelta = this.now() - this.state.startTime;
		const averageTime = timeDelta / progress;
		const progressLeft = total - progress;
		const estimate = averageTime * progressLeft;
		const speed = tick / averageTime;

		return {
			timeDelta,
			averageTime,
			progressLeft,
			speed,
			estimate,
		};
	}

	public now() {
		return this.timeFetcher();
	}
}
