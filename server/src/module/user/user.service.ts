import ResponseDto from "../../response/responsedto";
import { Prisma } from "@prisma/client";

interface UserService {
    createUser(user: Prisma.UserCreateInput): Promise<ResponseDto>;
    getUserById(id: number): Promise<ResponseDto>;
}

export default UserService;