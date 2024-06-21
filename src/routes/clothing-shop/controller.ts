import { FastifyRequest } from 'fastify';
import { ClothingShopPaymentBody } from './interface';
import StripeService from './service';

class ClothingShopController {
	private stripeService = new StripeService();

	public payment = async (req: FastifyRequest<{ Body: ClothingShopPaymentBody }>) => {
		const { token, amount } = req.body;

		return {
			data: await this.stripeService.createCharge(token.id, amount, 'usd'),
		};
	};
}

export default ClothingShopController;
