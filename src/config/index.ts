import 'dotenv/config';

// config({ path: `.env.${process.env.NODE_ENV ?? 'development'}.local` });

export const { API_VERSION, PORT, ORIGIN, STRIPE_SECRET_KEY } = process.env;
