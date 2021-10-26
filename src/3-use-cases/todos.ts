import { Todo } from "../4-entities/todos";

export const todos = ({
	getTodos,
	getTodoById,
	deleteAll,
}: {
	getTodos: () => Promise<Todo[]>;
	getTodoById: (id: Todo["id"]) => Promise<Todo | null>;
	deleteAll: () => Promise<void>;
}) => {
	return {
		get: (): Promise<Todo[]> => {
			return getTodos();
		},
		getById: (id: Todo["id"]): Promise<Todo | null> => {
			return getTodoById(id);
		},
		deleteAll: async (): Promise<void> => {
			await deleteAll();
		},
	};
};

export type Todos = ReturnType<typeof todos>;
