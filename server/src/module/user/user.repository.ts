import { Prisma, User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import CustomError from "../../error/custom.error";
import STATUS_CODES from "../../utility/status_codes";

class UserRepository {
    async findById(id: number): Promise<User> {
        const user: User | null = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            throw new CustomError(STATUS_CODES.NotFound,"User not found");
        }

        return user;
    }

    async createUser(user: Prisma.UserCreateInput): Promise<User>{
        const userExists = await prisma.user.findUnique({
            where:{
                email: user.email,
            }
        })

        if(userExists){
            throw new CustomError(STATUS_CODES.Conflict, "User already exists.")
        }

        const newUser: User = await prisma.user.create({
            data: user
        });

        const {password, ...userWithoutPassword} = newUser;

        return userWithoutPassword;
    }
}

export default UserRepository;