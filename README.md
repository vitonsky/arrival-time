Simple and powerful time estimation (ETA).

Ideal to draw progress in CLI, web and mobile.

- Zero dependencies. Works everywhere - node, browsers, toaster, etc.
- ETA, speed measurements and average step time estimation

![](./docs/eta.gif)

# Usage

Install with `npm i arrival-time` or `yarn add arrival-time`

```js
import { Estimation } from 'arrival-time';

const estimation = new Estimation();

// Update progress to 25 of 100, and get measurements
const measure1 = estimation.update(25, 100);
console.log("Estimated time", measure1.estimate); // Estimated time 0.11754299999961404
console.log("Estimated speed", measure1.speed); // Estimated speed 638064.3679355322

console.log(measure1);
// {
// 	timeDelta: 0.039180999999871347,
// 	averageTime: 0.0015672399999948539,
// 	progressLeft: 75,
// 	speed: 638064.3679355322,
// 	estimate: 0.11754299999961404
// }

console.log(estimation.update(50, 100))
// {
// 	timeDelta: 12.311336999999867,
// 	averageTime: 0.24622673999999733,
// 	progressLeft: 50,
// 	speed: 4061.297322947178,
// 	estimate: 12.311336999999867
// }
```

# API

### constructor

```ts
type Options = {
	// Current progress (default 0)
	progress?: number;
	// Total progress (default 100)
	total?: number;
	// Time to start count from (default - current time)
	startTime?: number;
	// Optionally, you may provide your own clock implementation,
	// that will return time as number
	timeFetcher?: TimeFetcher;
};
```

### update(progress: number, total?: number)

Update current progress, and optionally update total progress.

Returns updated object with measurements.

### measure(tick = 1000)

Return measurements object

```ts
type Measurements = {
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
```

### estimate()

Return `estimate` value

### reset(time?: number)

Reset start time to provided or current time

### now()

Return current timestamp

# Related projects

- [humanize-duration](https://www.npmjs.com/package/humanize-duration) - converts time in ms to human readable time
- [log-update](https://www.npmjs.com/package/log-update) - print and redraw messages to stdout
