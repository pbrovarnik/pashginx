import { FastifyInstance, FastifyReply, RouteOptions } from 'fastify';

export async function userRoutes(fastify: FastifyInstance, opts: RouteOptions, done: () => void) {
	fastify.route({
		method: 'GET',
		url: '/user',
		schema: {
			response: {
				200: {
					description: 'Successful response',
					type: 'string',
					example: 'ok',
				},
			},
		},
		handler: (_, reply: FastifyReply): void => {
			reply.send({ hello: 'world' });
		},
	});

	done();
}
