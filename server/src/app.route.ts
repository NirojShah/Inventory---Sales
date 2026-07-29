import { Router } from "express";
import type { Router as RouterType } from "express";
import type { Request, Response } from "express";
import inventoryRoute from "./module/inventory/inventory.route";
import userRouter from "./module/user/user.route";

const appRouter: RouterType = Router();

appRouter.get("/health", async (req: Request, res: Response) => {
    return res.status(201).send("OK")
})

appRouter.use("/inventory", inventoryRoute);
appRouter.use("/user", userRouter)


export default appRouter;