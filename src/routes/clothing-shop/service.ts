import Stripe from 'stripe';

import { STRIPE_SECRET_KEY } from '@config/index';

class StripeService {
	private stripe?: Stripe;

	constructor() {
		if (STRIPE_SECRET_KEY) this.stripe = new Stripe(STRIPE_SECRET_KEY);
	}

	public createCharge = async (source: string, amount: number, currency: string): Promise<any> => {
		try {
			return this.stripe?.charges.create({ source, amount, currency });
		} catch (error) {
			return error;
		}
	};
}

export default StripeService;
