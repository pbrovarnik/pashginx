type ResponseProperty = {
	message: {
		type: string;
	};
};

type ErrorResponse = {
	description: string;
	type?: string;
	properties: ResponseProperty;
};

export const responseProperty: ResponseProperty = {
	message: {
		type: 'string',
	},
};

export const ERROR400: ErrorResponse = {
	description: 'Bad request',
	type: 'object',
	properties: responseProperty,
};

export const ERROR401: ErrorResponse = {
	description: 'Unauthorized',
	type: 'object',
	properties: responseProperty,
};

export const ERROR403: ErrorResponse = {
	description: 'Forbidden Request',
	properties: responseProperty,
};

export const ERROR404: ErrorResponse = {
	description: 'Not found',
	properties: responseProperty,
};

export const ERROR409: ErrorResponse = {
	description: 'Conflict',
	properties: responseProperty,
};

export const ERROR500: ErrorResponse = {
	description: 'Internal Sever Error',
	properties: responseProperty,
};
