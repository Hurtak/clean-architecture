import { Storage } from "../1-data-providers/storage";
import { Todo, TodoWithoutId } from "../4-entities/todos";

export const todos = ({ storage }: { storage: Storage }) => {
	return {
		getAll: (): Promise<Todo[]> => {
			return storage.todos.getAll();
		},
		getById: (id: Todo["id"]): Promise<Todo | null> => {
			return storage.todos.getById(id);
		},
		create: (todoWithoutId: TodoWithoutId): Promise<Todo> => {
			return storage.todos.create(todoWithoutId);
		},
		patchById: (id: Todo["id"], partialTodoWithoutId: Partial<TodoWithoutId>): Promise<Todo | null> => {
			return storage.todos.patchById(id, partialTodoWithoutId);
		},
		deleteAll: (): Promise<void> => {
			return storage.todos.deleteAll();
		},
		deleteById: (id: Todo["id"]): Promise<Todo | null> => {
			return storage.todos.deleteById(id);
		},
	};
};

export type Todos = ReturnType<typeof todos>;
