# Node.js + TypeScript + Express Project Structure

A clean, production-ready starter structure for building REST APIs with Node.js, TypeScript, Express, and MongoDB (Mongoose).

## 📁 Project Structure

```
project-root/
├── src/
│   ├── env/
│   │   └── .env.example
│   ├── error/
│   │   ├── async.error.handler.ts
│   │   ├── custom.error.ts
│   │   └── global.error.handler.ts
│   ├── utility/
│   │   ├── db.connection.ts
│   │   └── env.config.ts
│   ├── app.ts
│   └── server.ts
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Setup From Scratch

### 1. Initialize the project

```bash
mkdir my-node-app && cd my-node-app
npm init -y
```

### 2. Install dependencies

```bash
npm install express cors mongoose dotenv
```

### 3. Install dev dependencies

```bash
npm install --save-dev typescript tsx @types/node @types/express @types/cors
```

| Package | Purpose |
|---|---|
| `typescript` | TypeScript compiler |
| `tsx` | Runs `.ts` files directly during development (replacement for `ts-node`) |
| `@types/node` | Type definitions for Node built-ins (`http`, `fs`, etc.) |
| `@types/express` | Type definitions for Express (`Request`, `Response`, etc.) |
| `@types/cors` | Type definitions for `cors` |
| `mongoose` | Ships its own types — no `@types/mongoose` needed |

### 4. Create `tsconfig.json`

```bash
npx tsc --init
```

Replace its contents with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src/**/*"]
}
```

> ⚠️ Do **not** add `"type": "module"` to `package.json` — this project uses CommonJS module resolution to keep imports simple (no `.js` extensions required in relative imports).

### 5. Create `.gitignore`

```
node_modules/
dist/
.env
```

### 6. Create the folder structure

```bash
mkdir -p src/env src/error src/utility
```

---

## 📄 File-by-File Guide

### `src/env/.env.example`

Template for required environment variables. Copy this to `.env` (which is gitignored) and fill in real values.

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/mydatabase
NODE_ENV=development
```

### `src/utility/env.config.ts`

Loads and validates environment variables in one place, so the rest of the app imports from here instead of using `process.env` directly everywhere.

```ts
import dotenv from "dotenv";

dotenv.config();

const envConfig = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI as string,
  nodeEnv: process.env.NODE_ENV || "development",
};

export default envConfig;
```

### `src/utility/db.connection.ts`

Generic, database-agnostic connection utility. It only accepts a connection string — it doesn't know or care where the URL comes from, so it can be reused with any Mongo URI (different environments, test DBs, multiple projects, etc.).

```ts
import mongoose from "mongoose";

const connectDB = async (dbUrl: string): Promise<void> => {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
```

### `src/error/custom.error.ts`

Custom typed error class that carries an HTTP status code, used to throw meaningful errors from anywhere in the app.

```ts
class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational: boolean = true, stack: string = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
```

### `src/error/async.error.handler.ts`

Wraps async route handlers so any thrown/rejected error is automatically forwarded to Express's error-handling middleware, avoiding repetitive `try/catch` blocks.

```ts
import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
```

### `src/error/global.error.handler.ts`

Centralized error-handling middleware — catches all errors passed via `next(err)` and sends a consistent JSON response.

```ts
import { Request, Response, NextFunction } from "express";
import ApiError from "./custom.error";

const globalErrorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default globalErrorHandler;
```

### `src/app.ts`

Sets up the Express application — middleware, routes, and error handlers.

```ts
import express, { Application } from "express";
import cors from "cors";
import globalErrorHandler from "./error/global.error.handler";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Global error handler must be registered last
app.use(globalErrorHandler);

export default app;
```

### `src/server.ts`

Entry point — creates the HTTP server, connects to the database, and starts listening.

```ts
import http from "http";
import { Server } from "http";
import app from "./app";
import connectDB from "./utility/db.connection";
import envConfig from "./utility/env.config";

const server: Server = http.createServer(app);

connectDB(envConfig.mongoUri).then(() => {
  server.listen(envConfig.port, () => {
    console.log(`Server running on port ${envConfig.port}`);
  });
});
```

---

## 📜 `package.json` Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts"
  }
}
```

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `tsx watch src/server.ts` | Development — runs TS directly, auto-restarts on file changes |
| `npm run build` | `tsc` | Compiles all `.ts` files in `src/` to `.js` in `dist/` |
| `npm run start` | `node dist/server.js` | Runs the compiled production build |

---

## ▶️ Running the Project

```bash
# 1. Clone or create the structure above
# 2. Install dependencies
npm install

# 3. Set up environment variables
cp src/env/.env.example .env
# then edit .env with your actual values

# 4. Run in development
npm run dev

# 5. For production
npm run build
npm run start
```

---

## 🧩 Adding New Packages — Quick Reference

| Situation | What to do |
|---|---|
| Package has built-in types (e.g. `mongoose`) | Just `npm install <package>` |
| Package needs separate types (e.g. `express`, `cors`) | `npm install <package>` + `npm install --save-dev @types/<package>` |
| Unsure if types exist | Check `node_modules/<package>/package.json` for a `"types"` field, or search `@types/<package>` on npmjs.com |