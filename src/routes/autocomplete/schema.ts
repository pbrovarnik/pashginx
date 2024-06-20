import { Type } from '@fastify/type-provider-typebox';
import { FastifySchema } from 'fastify';
import { ERROR400, ERROR401, ERROR404, ERROR409, ERROR500, responseProperty } from '@constants/constants';

export const TypedAutocompleteBody = Type.Object({
	word: Type.String(),
});

export const TypedAutocompleteQuery = Type.Object({
	q: Type.String(),
});

export const AcSuggestSchema: FastifySchema = {
	querystring: TypedAutocompleteQuery,
	response: {
		200: {
			description: 'Successful get response',
			type: 'object',
			properties: {
				...responseProperty,
				suggestions: { type: 'array', items: { type: 'string' } },
			},
		},
		400: ERROR400,
		409: ERROR409,
		500: ERROR500,
	},
};

export const AcInsertSchema: FastifySchema = {
	response: {
		200: {
			description: 'Successful post response',
			type: 'object',
			properties: {
				...responseProperty,
			},
		},
		400: ERROR400,
		401: ERROR401,
		404: ERROR404,
		500: ERROR500,
	},
};

export const AcDeleteSchema: FastifySchema = {
	response: {
		200: {
			description: 'Successful delete response',
			type: 'object',
			properties: {
				...responseProperty,
			},
		},
		400: ERROR400,
		401: ERROR401,
		404: ERROR404,
		500: ERROR500,
	},
};
