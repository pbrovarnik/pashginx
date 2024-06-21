import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { FastifyPluginOptions } from 'fastify';

import { Routes } from '@interfaces/route';
import IndexRoute from '@routes/index/route';
import AutocompleteRoute from '@routes/autocomplete/route';
import ClothingShopRoute from '../routes/clothing-shop/route';

export const initializeRoutes: FastifyPluginCallbackTypebox<FastifyPluginOptions> = (server, _, done) => {
	const routes = [new IndexRoute(), new AutocompleteRoute(), new ClothingShopRoute()];

	routes.forEach((route: Routes) => {
		server.register(route.initializeRoutes.bind(route));
	});

	done();
};
