import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Required environment variables
const requiredEnvVars = [
  'PRIVATE_KEY',
  'RPC_URL',
  'PORT',
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export const config = {
  privateKey: process.env.PRIVATE_KEY as string,
  rpcUrl: process.env.RPC_URL as string,
  port: parseInt(process.env.PORT || '3000', 10),
  amountEth: process.env.AMOUNT_ETH || '0.01',
  slippage: parseFloat(process.env.SLIPPAGE || '0.005'),
} as const;