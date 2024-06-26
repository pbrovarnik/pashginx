import { Type } from '@fastify/type-provider-typebox';
import { FastifySchema } from 'fastify';
import { ERROR400, ERROR401, ERROR404, ERROR500, responseProperty } from '@constants/constants';

export const TypedClothingShopPaymentBody = Type.Object({
	token: Type.Object({
		id: Type.String(),
		client_ip: Type.String(),
		created: Type.Number(),
		email: Type.String(),
		livemode: Type.Boolean(),
		object: Type.String(),
		type: Type.String(),
		used: Type.Boolean(),
	}),
	amount: Type.Number(),
});

export const ClothingShopPaymentSchema: FastifySchema = {
	response: {
		200: {
			description: 'Successful post response',
			type: 'object',
			properties: {
				...responseProperty,
				data: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						object: { type: 'string' },
						amount: { type: 'number' },
						amount_captured: { type: 'number' },
						amount_refunded: { type: 'number' },
						application: { type: 'number' },
						application_fee: { type: 'string' },
						application_fee_amount: { type: 'number' },
						balance_transaction: { type: 'string' },
						billing_details: {
							type: 'object',
							properties: {
								address: {
									type: 'object',
									properties: {
										city: { type: 'string' },
										country: { type: 'string' },
										line1: { type: 'string' },
										line2: { type: 'string' },
										postal_code: { type: 'string' },
										state: { type: 'string' },
									},
								},
								email: { type: 'string' },
								name: { type: 'string' },
								phone: { type: 'string' },
							},
						},
						calculated_statement_descriptor: { type: 'string' },
						captured: { type: 'boolean' },
						created: { type: 'number' },
						currency: { type: 'string' },
						customer: { type: 'string' },
						description: { type: 'string' },
						destination: { type: 'string' },
						dispute: { type: 'string' },
						disputed: { type: 'boolean' },
						failure_message: { type: 'string' },
						livemode: { type: 'boolean' },
						outcome: {
							type: 'object',
							properties: {
								network_status: { type: 'string' },
								reason: { type: 'string' },
								risk_level: { type: 'string' },
								risk_score: { type: 'number' },
								seller_message: { type: 'string' },
								type: { type: 'string' },
							},
						},
						paid: { type: 'boolean' },
						payment_intent: { type: 'string' },
						payment_method: { type: 'string' },
						payment_method_details: {
							type: 'object',
							properties: {
								card: {
									type: 'object',
									properties: {
										amount_authorized: { type: 'number' },
										brand: { type: 'string' },
										country: { type: 'string' },
										exp_month: { type: 'number' },
										exp_year: { type: 'number' },
										fingerprint: { type: 'string' },
										funding: { type: 'string' },
										last4: { type: 'string' },
										mandate: { type: 'string' },
										network: { type: 'string' },
									},
								},
								type: { type: 'string' },
							},
						},
						receipt_email: { type: 'string' },
						receipt_number: { type: 'string' },
						receipt_url: { type: 'string' },
						refunded: { type: 'boolean' },
						source: {
							type: 'object',
							properties: {
								id: { type: 'string' },
								object: { type: 'string' },
								address_city: { type: 'string' },
								address_country: { type: 'string' },
								address_line1: { type: 'string' },
								address_line1_check: { type: 'string' },
								address_line2: { type: 'string' },
								address_state: { type: 'string' },
								address_zip: { type: 'string' },
								address_zip_check: { type: 'string' },
								brand: { type: 'string' },
								country: { type: 'string' },
								cvc_check: { type: 'string' },
								exp_month: { type: 'number' },
								exp_year: { type: 'number' },
								fingerprint: { type: 'string' },
								funding: { type: 'string' },
								last4: { type: 'string' },
								name: { type: 'string' },
								tokenization_method: { type: 'string' },
								wallet: { type: 'string' },
							},
						},
						source_transfer: { type: 'string' },
						statement_descriptor: { type: 'string' },
						statement_descriptor_suffix: { type: 'string' },
						status: { type: 'string' },
						transfer_data: { type: 'string' },
						transfer_group: { type: 'string' },
					},
				},
			},
		},
		400: ERROR400,
		401: ERROR401,
		404: ERROR404,
		500: ERROR500,
	},
};
