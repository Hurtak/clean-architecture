export const idDoesNotExist = 0;

export const getId: () => number = (() => {
	let id = 1;
	return () => id++;
})();
