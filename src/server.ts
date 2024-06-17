import Fastify from 'fastify';

const port = parseInt(process.env.PORT) || 3000;
const host = 'RENDER' in process.env ? `0.0.0.0` : `localhost`;

const fastify = Fastify({
	logger: true,
});

fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});

const start = async () => {
	try {
		await fastify.listen({ host, port });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
