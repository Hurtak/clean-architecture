import { ZodError } from "zod";

export type ErrorResponse = {
	error: {
		name: string;
		message: string;
		additionalData?: unknown;
	};
};

export const createErrorResponse = (error: Error | ZodError): ErrorResponse => {
	if (error instanceof ZodError) {
		return {
			error: {
				name: "ValidationError",
				message: "Invalid shape the request data",
				additionalData: error.issues,
			},
		};
	}

	return {
		error: {
			name: error.name,
			message: error.message,
		},
	};
};
