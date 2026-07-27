import express from "express";
import type { Express } from "express";
import configureEnv from "./utility/env.config";
import cors from "cors"
import globalErrorHandler from "./error/global.error.handler";
import appRouter from "./app.route";

const app: Express = express();

const environment: string = process.env.NODE_ENV || "dev";

configureEnv(environment);

app.use(express.json())
app.use(cors({
    origin: "*"
}
))

app.use("/app/v1",appRouter);


app.use(globalErrorHandler)


export default app;