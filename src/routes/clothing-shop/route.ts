import { FastifyInstance, RouteOptions } from 'fastify';
import { ClothingShopPaymentSchema } from './schema';
import ClothingShopController from './controller';
import { Routes } from '@root/src/interfaces/route';

class ClothingShopRoute implements Routes {
	public path = '/clothing-shop';
	public clothingShopController = new ClothingShopController();

	public initializeRoutes(server: FastifyInstance, _: RouteOptions, done: () => void) {
		server.route({
			method: 'POST',
			url: `${this.path}/payment`,
			schema: ClothingShopPaymentSchema,
			handler: this.clothingShopController.payment,
		});

		done();
	}
}

export default ClothingShopRoute;
