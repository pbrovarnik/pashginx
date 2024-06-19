import Fastify, { FastifyError } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyCompress from '@fastify/compress';
import fastifyEnv from '@fastify/env';

import { schema } from '@utils/validate-env';
import { API_VERSION, PORT } from '@config/index';
import { initializeRoutes } from '@plugins/initializeRoutes';

const port = PORT ? parseInt(PORT) : 3000;
const host = 'RENDER' in process.env ? '0.0.0.0' : 'localhost';
const urls = ['example1.com', 'exam.com'];

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifyEnv, { dotenv: true, schema });
fastify.register(fastifyCors, {
	origin: urls,
	methods: ['GET', 'POST'],
	credentials: true,
});
fastify.register(fastifyHelmet);
fastify.register(fastifyCompress);

fastify.register(initializeRoutes, { prefix: `api/${API_VERSION}` });

fastify.setErrorHandler((error: FastifyError, request, reply) => {
	const status: number = error.statusCode ?? 500;
	const message: string = status === 500 ? 'Something went wrong' : error.message ?? 'Something went wrong';

	fastify.log.error(`[${request.method}] ${request.url} >> StatusCode:: ${status}, Message:: ${message}`);

	return reply.status(status).send({ error: true, message });
});

export const startServer = async () => {
	try {
		await fastify.listen({ host, port });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
