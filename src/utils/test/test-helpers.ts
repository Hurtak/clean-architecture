export const idDoesNotExist = 0;

export const getId: () => number = (() => {
	let id = 1;
	return () => id++;
})();

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
