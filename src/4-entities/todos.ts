export type Todo = {
	id: number;
	text: string;
	completed: boolean;
};

export const validateText = (text: Todo["text"]): boolean => text.length <= 100;
