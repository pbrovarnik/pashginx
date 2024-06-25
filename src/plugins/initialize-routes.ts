import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { FastifyPluginOptions } from 'fastify';

import { Routes } from '@interfaces/route';
import IndexRoute from '@routes/index/route';
import AutocompleteRoute from '@routes/autocomplete/route';
import ClothingShopRoute from '@routes/clothing-shop/route';
import ChessParty from '@routes/chess-party/route';

export const initializeRoutes: FastifyPluginCallbackTypebox<FastifyPluginOptions> = (server, _, done) => {
	const routes = [new AutocompleteRoute(), new ClothingShopRoute(), new ChessParty(), new IndexRoute()];

	routes.forEach((route: Routes) => {
		server.register(route.initializeRoutes.bind(route));
	});

	done();
};
