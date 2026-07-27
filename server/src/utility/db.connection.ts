import { prisma } from "../lib/prisma";

async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('DB CONNECTED [PostgreSQL] - [inv_sales]');
  } catch (err) {
    console.error(' Database connection failed:', (err as Error).message);
    process.exit(1); 
  }
}

export default connectDatabase;