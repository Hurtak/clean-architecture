export type ValueFromPromise<T> = T extends PromiseLike<infer U> ? U : T;

export const never = (): never => {
	throw new Error("This should never happen");
};
