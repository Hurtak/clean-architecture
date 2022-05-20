import { ApiResponse } from "./api-utis";

export const apiHeartbeat = () => {
	return {
		heartbeat: (): ApiResponse<"OK"> => {
			return { status: 200, body: "OK" };
		},
	};
};
