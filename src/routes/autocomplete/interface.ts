import { Static } from '@fastify/type-provider-typebox';

import { TypedAutocompleteBody, TypedAutocompleteQuery } from './schema';

export type AutocompleteBody = Static<typeof TypedAutocompleteBody>;
export type AutocompleteQuery = Static<typeof TypedAutocompleteQuery>;

export interface GetUser {
	email: string;
}
