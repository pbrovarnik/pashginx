import { Type } from '@sinclair/typebox';

export const schema = Type.Object({
	API_VERSION: Type.String(),
	PORT: Type.String(),
	ORIGIN: Type.String(),
	STRIPE_SECRET_KEY: Type.String(),
});
