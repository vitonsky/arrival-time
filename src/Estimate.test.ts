import { Estimate } from '.';

test('basic test', () => {
	const estimate = new Estimate();
	expect(estimate.update(50, 100).speed).toBeGreaterThan(50);
});
