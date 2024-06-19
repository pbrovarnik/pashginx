import Fastify, { FastifyError } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyCompress from '@fastify/compress';
import fastifyEnv from '@fastify/env';

import { schema } from '@utils/validate-env';
import { API_VERSION, ORIGIN, PORT } from '@config/index';
import { initializeRoutes } from '@plugins/initializeRoutes';

const port = PORT ? parseInt(PORT) : 3000;
const host = 'RENDER' in process.env ? '0.0.0.0' : 'localhost';

const server = Fastify({
	logger: true,
});

server.register(fastifyEnv, { dotenv: true, schema });
server.register(fastifyCors, {
	origin: ORIGIN,
	methods: ['GET', 'POST'],
	credentials: true,
});
server.register(fastifyHelmet);
server.register(fastifyCompress);

server.register(initializeRoutes, { prefix: `api/${API_VERSION}` });

server.setErrorHandler((error: FastifyError, request, reply) => {
	const status: number = error.statusCode ?? 500;
	const message: string = status === 500 ? 'Something went wrong' : error.message ?? 'Something went wrong';

	server.log.error(`[${request.method}] ${request.url} >> StatusCode:: ${status}, Message:: ${message}`);

	return reply.status(status).send({ error: true, message });
});

export const startServer = async () => {
	try {
		await server.listen({ host, port });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};
