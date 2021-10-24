import { z } from "zod";

import { Todo } from "../../4-entities/todos";
import { StorageClient } from "./storage-client";

export const storageTodos = ({ storageClient }: { storageClient: StorageClient }) => {
	return {
		get: async (): Promise<Todo[]> => {
			const data = await storageClient.query(
				z.object({
					id: z.number(),
					text: z.string(),
					completed: z.number(),
				}),
				`
					SELECT id, text, completed
					FROM todos;
				`
			);

			return data.map((t) => ({
				id: t.id,
				text: t.text,
				completed: Boolean(t.completed),
			}));
		},
	};
};
