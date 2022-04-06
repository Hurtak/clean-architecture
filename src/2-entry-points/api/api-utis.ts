import { RouterContext } from "@koa/router";
import { ZodError } from "zod";

type ApiResponseError = { status: 400; body: ErrorResponse } | { status: 404 };
export type ApiResponse<T> = { status: 200; body: T } | { status: 204 } | ApiResponseError;

export type ApiRequestValidation<T> = { type: "VALID"; data: T } | { type: "INVALID"; body: ApiResponseError };

export type ApiRequestParams = Record<string, string>;
export type ApiRequestBody = unknown;

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
				name: "ErrorValidation",
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
			name: "ErrorUnknown",
			message: "Unknown error",
			additionalData: error,
		},
	};
};

export const apiResponseApply = <T>(ctx: RouterContext, apiResponse: ApiResponse<T>): void => {
	ctx.status = apiResponse.status;
	if ("body" in apiResponse) {
		ctx.body = apiResponse.body;
	}
};
