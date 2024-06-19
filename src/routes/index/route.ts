import { FastifyInstance, RouteOptions } from 'fastify';

import Controller from './controller';
import { Routes } from '@interfaces/route';

class IndexRoute implements Routes {
	public path = '/';

	public indexController = new Controller();

	public initializeRoutes(fastify: FastifyInstance, _: RouteOptions, done: () => void) {
		fastify.route({
			method: 'GET',
			url: this.path,
			schema: {
				response: {
					200: {
						description: 'Successful response',
						type: 'string',
						example: 'ok',
					},
				},
			},
			handler: Controller.index,
		});
		done();
	}
}

export default IndexRoute;
