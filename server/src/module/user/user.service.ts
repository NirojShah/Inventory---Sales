import ResponseDto from "../../response/responsedto";
import { CreateUserDto } from "./user.model";

interface UserService {
    createUser(user: CreateUserDto): Promise<ResponseDto>;
    getUserById(id: number): Promise<ResponseDto>;
}

export default UserService;