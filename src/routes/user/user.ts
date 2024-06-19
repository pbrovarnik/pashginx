import { FastifyInstance, FastifyReply, RouteOptions } from 'fastify';

export async function userRoutes(server: FastifyInstance, _: RouteOptions, done: () => void) {
	server.route({
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
