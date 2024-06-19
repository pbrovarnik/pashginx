import { FastifyInstance, RouteOptions } from 'fastify';

import Controller from './controller';
import { Routes } from '@interfaces/route';
import { AcDeleteSchema, AcInsertSchema, AcSuggestSchema } from './schema';

class AutocompleteRoute implements Routes {
	public path = '/autocomplete';
	public acController = new Controller();

	public initializeRoutes(server: FastifyInstance, _: RouteOptions, done: () => void) {
		server.route({
			method: 'GET',
			url: `${this.path}/suggest`,
			schema: AcSuggestSchema,
			handler: this.acController.suggest,
		});

		server.route({
			method: 'POST',
			url: `${this.path}/insert`,
			schema: AcInsertSchema,
			handler: this.acController.insert,
		});

		server.route({
			method: 'DELETE',
			url: `${this.path}/delete`,
			schema: AcDeleteSchema,
			handler: this.acController.delete,
		});

		done();
	}
}

export default AutocompleteRoute;
