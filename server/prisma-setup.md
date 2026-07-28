# Express + PostgreSQL + Prisma 7 Integration Guide

This document provides a step-by-step setup guide for configuring **Prisma 7** in an **Express + TypeScript** project connected to a **PostgreSQL** database.

---

## 1. Schema Configuration (`prisma/schema.prisma`)

In Prisma 7, type-safe client files are generated into a local project folder (`prisma/generated/client`).

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

---

## 2. Install Required Dependencies

Prisma 7 uses JavaScript/TypeScript driver adapters (such as `@prisma/adapter-pg` and `pg`) rather than built-in Rust database bindings.

Run the following command in your server directory:

```bash
npm install @prisma/adapter-pg pg
npm install --save-dev @types/pg
```

---

## 3. Generate Prisma Client

Generate the Prisma client code and type definitions into the specified output directory:

```bash
npx prisma generate
```

---

## 4. Create Singleton Prisma Instance (`src/lib/prisma.ts`)

Create a singleton instance of `PrismaClient` using the `@prisma/adapter-pg` driver adapter.

```typescript
// src/lib/prisma.ts

import { PrismaClient } from '../../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Initialize the PostgreSQL driver adapter
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Singleton pattern for global PrismaClient instance
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

> **Note on import paths:** Adjust `'../../prisma/generated/client'` depending on the relative location of `src/lib/prisma.ts` to `prisma/generated/client`.

---

## 5. Database Connection Helper (`src/utils/connectDatabase.ts`)

Create a database connection check function using Prisma's `$connect()` method:

```typescript
// src/utils/connectDatabase.ts

import { prisma } from '../lib/prisma';

async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('Successfully connected to PostgreSQL database!');
  } catch (err) {
    console.error('Database connection failed:', (err as Error).message);
    process.exit(1);
  }
}

export default connectDatabase;
```

---

## 6. Server Entry Point (`src/server.ts`)

Invoke `connectDatabase()` prior to starting your Express listener:

```typescript
// src/server.ts

import express from 'express';
import connectDatabase from './utils/connectDatabase';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

async function startServer() {
  // Verify database connection before starting Express
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`SERVER STARTED ON - ${PORT}`);
  });
}

startServer();
```

---

## 7. Troubleshooting TypeScript Errors in VS Code

If VS Code displays a `ts(2305)` or module resolution error on the `PrismaClient` import after running `npx prisma generate`:

1. Open the Command Palette in VS Code: `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS).
2. Run **`TypeScript: Restart TS Server`**.
3. Re-open the file.