import { Todo, TodoWithoutId } from "../4-domain/todos";

export const todos = ({
	todos,
}: {
	todos: {
		getAll: () => Promise<Todo[]>;
		getById: (id: Todo["id"]) => Promise<Todo | null>;
		create: (todoWithoutId: TodoWithoutId) => Promise<Todo>;
		patchById: (id: Todo["id"], partialTodo: Partial<TodoWithoutId>) => Promise<Todo | null>;
		deleteAll: () => Promise<void>;
		deleteById: (id: Todo["id"]) => Promise<Todo | null>;
	};
}) => {
	return {
		getAll: (): Promise<Todo[]> => {
			return todos.getAll();
		},
		getById: (id: Todo["id"]): Promise<Todo | null> => {
			return todos.getById(id);
		},
		create: (todoWithoutId: TodoWithoutId): Promise<Todo> => {
			return todos.create(todoWithoutId);
		},
		patchById: (id: Todo["id"], partialTodoWithoutId: Partial<TodoWithoutId>): Promise<Todo | null> => {
			return todos.patchById(id, partialTodoWithoutId);
		},
		deleteAll: (): Promise<void> => {
			return todos.deleteAll();
		},
		deleteById: (id: Todo["id"]): Promise<Todo | null> => {
			return todos.deleteById(id);
		},
	};
};

export type Todos = ReturnType<typeof todos>;
