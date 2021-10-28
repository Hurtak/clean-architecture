import { ZodError } from "zod";

export type ErrorResponse = {
	error: {
		name: string;
		message: string;
		additionalData?: unknown;
	};
};

export const createErrorResponse = (error: unknown): ErrorResponse => {
	if (error instanceof ZodError) {
		return {
			error: {
				name: "ValidationError",
				message: "Invalid shape the request data",
				additionalData: error.issues,
			},
		};
	} else if (error instanceof Error) {
		return {
			error: {
				name: error.name,
				message: error.message,
			},
		};
	}

	return {
		error: {
			name: "UnknownError",
			message: "Unknown error",
			additionalData: error,
		},
	};
};
