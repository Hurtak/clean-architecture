import { Storage } from "../1-data-providers/storage";
import { Todo } from "../4-entities/todos";

export const todos = ({ storage }: { storage: Storage }) => {
	return {
		get: (): Promise<Todo[]> => {
			return storage.todos.get();
		},
	};
};

export type Todos = ReturnType<typeof todos>;
