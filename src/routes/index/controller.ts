import { FastifyReply, FastifyRequest } from 'fastify';

class IndexController {
	public static index = (_: FastifyRequest, reply: FastifyReply): void => {
		reply.send('Service is up!');
	};
}

export default IndexController;
