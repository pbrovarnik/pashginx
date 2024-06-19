import 'dotenv/config';

// config({ path: `.env.${process.env.NODE_ENV ?? 'development'}.local` });

export const { NODE_ENV, PORT, API_VERSION, ORIGIN } = process.env;
