import { FastifyInstance, RouteOptions } from 'fastify';

export interface Routes {
	path: string;
	initializeRoutes: (server: FastifyInstance, opts: RouteOptions, done: () => void) => void;
}
