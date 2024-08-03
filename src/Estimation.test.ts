import { Estimation } from '.';

const createCounter = ({
	value = 0,
	step = 1,
}: { step?: number; value?: number } = {}) => {
	let counter = value;
	return () => {
		counter += step;
		return counter;
	};
};

describe('basic usage', () => {
	test('4 steps to complete', () => {
		const timerMock = createCounter();
		const estimate = new Estimation({ timeFetcher: timerMock });

		expect(estimate.update(25, 100)).toEqual(
			expect.objectContaining({
				timeDelta: 1,
				estimate: 3,
				progressLeft: 75,
			}),
		);

		expect(estimate.update(50, 100)).toEqual(
			expect.objectContaining({
				timeDelta: 2,
				estimate: 2,
				progressLeft: 50,
			}),
		);

		expect(estimate.update(75, 100)).toEqual(
			expect.objectContaining({
				timeDelta: 3,
				estimate: 1,
				progressLeft: 25,
			}),
		);

		expect(estimate.update(100, 100)).toEqual(
			expect.objectContaining({
				timeDelta: 4,
				estimate: 0,
				progressLeft: 0,
			}),
		);
	});

	test('big numbers in progress and total', () => {
		const timerMock = createCounter();
		const estimate = new Estimation({ timeFetcher: timerMock });

		expect(estimate.update(25_000_000, 100_000_000)).toEqual(
			expect.objectContaining({
				timeDelta: 1,
				estimate: 3,
				progressLeft: 75_000_000,
			}),
		);

		expect(estimate.update(50_000_000, 100_000_000)).toEqual(
			expect.objectContaining({
				timeDelta: 2,
				estimate: 2,
				progressLeft: 50_000_000,
			}),
		);

		expect(estimate.update(75_000_000, 100_000_000)).toEqual(
			expect.objectContaining({
				timeDelta: 3,
				estimate: 1,
				progressLeft: 25_000_000,
			}),
		);

		expect(estimate.update(100_000_000, 100_000_000)).toEqual(
			expect.objectContaining({
				timeDelta: 4,
				estimate: 0,
				progressLeft: 0,
			}),
		);
	});

	test('reset call increase speed', () => {
		const timerMock = createCounter();
		const estimate = new Estimation({ timeFetcher: timerMock });

		expect(estimate.update(25, 100)).toEqual(
			expect.objectContaining({
				timeDelta: 1,
				speed: 25_000,
				progressLeft: 75,
			}),
		);

		expect(estimate.update(50, 100)).toEqual(
			expect.objectContaining({
				timeDelta: 2,
				speed: 25_000,
				progressLeft: 50,
			}),
		);

		estimate.reset();

		expect(estimate.update(75, 100)).toEqual(
			expect.objectContaining({
				timeDelta: 1,
				speed: 75_000,
				progressLeft: 25,
			}),
		);

		expect(estimate.update(100, 100)).toEqual(
			expect.objectContaining({
				timeDelta: 2,
				speed: 50_000,
				progressLeft: 0,
			}),
		);
	});
});

describe('cases with real timer', () => {
	test('100 steps to complete', () => {
		const estimate = new Estimation({ timeFetcher: () => performance.now() });

		for (
			let state = { progress: 1, total: 100 };
			state.progress <= state.total;
			state.progress += 1
		) {
			const measures = estimate.update(state.progress, state.total);
			expect(measures.speed).toBeGreaterThan(1000);
			expect(measures.averageTime).toBeLessThan(0.5);
		}
	});
});
