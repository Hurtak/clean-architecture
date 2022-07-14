import { Todo } from "../../4-domain/todos";
import { TodoWithoutId } from "./todos-types";

export const todos = ({
	todos,
}: {
	todos: {
		getAll: () => Promise<Todo[]>;
		getById: (id: Todo["id"]) => Promise<Todo | undefined>;
		create: (todoWithoutId: TodoWithoutId) => Promise<Todo | undefined>;
		patchById: (id: Todo["id"], partialTodo: Partial<TodoWithoutId>) => Promise<Todo | undefined>;
		deleteAll: () => Promise<void>;
		deleteById: (id: Todo["id"]) => Promise<Todo | undefined>;
	};
}) => {
	return {
		getAll: (): Promise<Todo[]> => {
			return todos.getAll();
		},
		getById: (id: Todo["id"]): Promise<Todo | undefined> => {
			return todos.getById(id);
		},
		create: (todoWithoutId: TodoWithoutId): Promise<Todo | undefined> => {
			return todos.create(todoWithoutId);
		},
		patchById: (id: Todo["id"], partialTodoWithoutId: Partial<TodoWithoutId>): Promise<Todo | undefined> => {
			return todos.patchById(id, partialTodoWithoutId);
		},
		deleteAll: (): Promise<void> => {
			return todos.deleteAll();
		},
		deleteById: (id: Todo["id"]): Promise<Todo | undefined> => {
			return todos.deleteById(id);
		},
	};
};

export type Todos = ReturnType<typeof todos>;
