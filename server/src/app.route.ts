import { Router } from "express";
import type { Router as RouterType } from "express";
import type { Request, Response } from "express";
import inventoryRoute from "./module/inventory/inventory.route";

const appRouter: RouterType = Router();

appRouter.get("/health", async (req: Request, res: Response) => {
    return res.status(201).send("OK")
})

appRouter.use("/inventory", inventoryRoute);


export default appRouter;