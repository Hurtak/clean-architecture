export type ValueFromPromise<T> = T extends PromiseLike<infer U> ? U : T;
