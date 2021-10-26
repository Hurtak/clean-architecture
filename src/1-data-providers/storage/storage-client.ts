import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { z } from "zod";

import { ValueFromPromise } from "../../utils/typescript";

type Sql = string;
type ValidatorGeneric<T> = z.ZodType<T>;
type ValidatorResultGeneric<T1, T2 extends ValidatorGeneric<T1>> = z.infer<T2>;
type QueryParams = { [key: `$${string}`]: string | number | boolean };

export const storageClient = async () => {
	const database = await open({
		filename: ":memory:",
		driver: sqlite3.cached.Database, // eslint-disable-line @typescript-eslint/unbound-method
	});

	return {
		query: async <T, TValidator extends ValidatorGeneric<T>, TResult extends ValidatorResultGeneric<T, TValidator>>(
			validator: TValidator,
			sql: Sql,
			params?: QueryParams
		): Promise<TResult[]> => {
			const result = await database.all(sql, params);
			return z.array(validator).parse(result) as TResult[];
		},
		queryOne: async <
			T,
			TValidator extends ValidatorGeneric<T>,
			TResult extends ValidatorResultGeneric<T, TValidator>
		>(
			validator: TValidator,
			sql: Sql,
			params?: QueryParams
		): Promise<TResult | null> => {
			const result = await database.get<TResult>(sql, params);
			return result !== undefined ? (validator.parse(result) as TResult) : null;
		},
		queryOneAlwaysResult: async <
			T,
			TValidator extends ValidatorGeneric<T>,
			TResult extends ValidatorResultGeneric<T, TValidator>
		>(
			validator: TValidator,
			sql: Sql,
			params?: QueryParams
		): Promise<TResult> => {
			const result = await database.get<TResult>(sql, params);
			return validator.parse(result) as TResult;
		},

		mutation: async (sql: Sql, params?: QueryParams): Promise<void> => {
			await database.run(sql, params);
		},
	};
};

export type StorageClient = ValueFromPromise<ReturnType<typeof storageClient>>;
