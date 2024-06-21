import { Static } from '@fastify/type-provider-typebox';

import { TypedClothingShopPaymentBody } from './schema';

export type ClothingShopPaymentBody = Static<typeof TypedClothingShopPaymentBody>;
