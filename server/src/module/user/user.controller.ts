import type { Request, Response } from "express";
import UserServiceImplementation from "./user.serviceImpl";
import ResponseDto from "../../response/responsedto";

class UserController {
    private userService = new UserServiceImplementation();

    async createUser(req: Request, res: Response): Promise<void> {
        const response: ResponseDto = await this.userService.createUser(req.body);
        console.log(response)
        res.status(response.statusCode).json(response);
    }

    async getUser(req: Request, res: Response): Promise<void> {
        const id: number = Number(req.params.id);
        const response = await this.userService.getUserById(id);
        res.status(response.statusCode).json(response);
    }
}

export default UserController;