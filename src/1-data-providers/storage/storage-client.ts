import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { z } from "zod";

import { ValueFromPromise } from "../../utils/typescript";

type Sql = string;
type ValidatorGeneric<T> = z.ZodType<T>;
type ValidatorResultGeneric<T1, T2 extends ValidatorGeneric<T1>> = z.infer<T2>;

export const storageClient = async () => {
	const database = await open({
		filename: ":memory:",
		driver: sqlite3.cached.Database, // eslint-disable-line @typescript-eslint/unbound-method
	});

	return {
		query: async <T, TValidator extends ValidatorGeneric<T>, TResult extends ValidatorResultGeneric<T, TValidator>>(
			validator: TValidator,
			sql: Sql
		): Promise<TResult[]> => {
			const result = await database.all(sql);
			return z.array(validator).parse(result) as TResult[];
		},

		mutation: async (sql: Sql): Promise<void> => {
			await database.exec(sql);
		},
	};
};

export type StorageClient = ValueFromPromise<ReturnType<typeof storageClient>>;
