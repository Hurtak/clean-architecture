/* eslint-disable no-console */

const formatMessage = (prefix: string, message: string) => `${prefix}:\t${message}`;

export const logger = ({ prefix }: { prefix: string }) => {
	return {
		verbose: (message: string) => console.log(formatMessage(prefix, message)),
		log: (message: string) => console.log(formatMessage(prefix, message)),
		warn: (message: string) => console.warn(formatMessage(prefix, message)),
		error: (message: string) => console.error(formatMessage(prefix, message)),
	};
};

export type Logger = ReturnType<typeof logger>;
