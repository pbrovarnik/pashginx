import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { FastifyPluginOptions } from 'fastify';

import { Routes } from '@interfaces/route';
import IndexRoute from '@routes/index/route';

export const initializeRoutes: FastifyPluginCallbackTypebox<FastifyPluginOptions> = (server, _, done) => {
	const routes = [new IndexRoute()];

	routes.forEach((route: Routes) => {
		server.register(route.initializeRoutes.bind(route));
	});

	done();
};