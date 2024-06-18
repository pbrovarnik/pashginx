import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { FastifyPluginOptions, FastifyInstance, RouteOptions } from 'fastify';
import IndexRoute from '../routes/index/route.ts';
import { Routes } from 'interfaces/route.ts';

export const initializeRoutes: FastifyPluginCallbackTypebox<FastifyPluginOptions> = (server, options, done) => {
	const routes = [new IndexRoute()];

	routes.forEach((route: Routes) => {
		server.register(route.initializeRoutes.bind(route));
	});

	done();
};
