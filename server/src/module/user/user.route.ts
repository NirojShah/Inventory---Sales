import { Router, Request, Response } from "express";
import asyncHandler from "../../error/async.error.handler";
import UserController from "./user.controller";

const userController = new UserController();
const userRouter = Router();

userRouter.get("/:id", asyncHandler(async (req: Request, res: Response) => {
    await userController.getUser(req, res);
}));

userRouter.post("/", asyncHandler(async (req: Request, res: Response) => {
    await userController.createUser(req, res);
}))

export default userRouter;