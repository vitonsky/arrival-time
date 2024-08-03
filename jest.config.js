const jestGlobals = {};

// Speedup tests, with disable type checking
if (process.env.TEST_FAST) {
	const RED_COLOR = '\x1b[31m';
	console.warn(RED_COLOR, 'TESTS DO NOT CHECK A TYPES!\n\n');

	jestGlobals['ts-jest'] = {
		isolatedModules: true,
	};
}

module.exports = {
	testEnvironment: 'node',
	preset: 'ts-jest/presets/js-with-ts-esm',
	...(Object.keys(jestGlobals).length === 0 ? {} : { globals: jestGlobals }),

	resetMocks: true,
	setupFiles: ['./scripts/jest/setupFiles/index.js'],
};
