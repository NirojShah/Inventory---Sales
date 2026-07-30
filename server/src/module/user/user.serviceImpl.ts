import { Prisma, User } from "@prisma/client";
import UserService from "./user.service";
import UserRepository from "./user.repository";
import ResponseDto from "../../response/responsedto";
import STATUS_CODES from "../../utility/status_codes";
import { CreateUserDto } from "./user.model";

class UserServiceImplementation implements UserService {
    private userRepository = new UserRepository();

    async createUser(user: CreateUserDto): Promise<ResponseDto> {
        const createdUser: User = await this.userRepository.createUser(user);
        return new ResponseDto(
            STATUS_CODES.CREATED,
            "User created successfully.",
            { ...createdUser, id: createdUser.id?.toString() as any }
        );
    }

    async getUserById(id: number): Promise<ResponseDto> {
        const user: User = await this.userRepository.findById(id);
        return new ResponseDto(
            STATUS_CODES.OK,
            "User found",
            { ...user, id: user.id?.toString() as any }
        );
    }
}

export default UserServiceImplementation;