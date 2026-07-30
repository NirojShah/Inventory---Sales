import { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import CustomError from "../../error/custom.error";
import STATUS_CODES from "../../utility/status_codes";
import { CreateUserDto, serializeBigInt, UserWithAddressResponse } from "./user.model";

class UserRepository {
    async findById(userId: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: BigInt(userId),
            },
            include: {
                address: true,
            },
        });

        if (!user) {
            throw new CustomError(STATUS_CODES.NotFound, "User not found");
        }

        const { password, ...userWithoutPassword } = user;

        return serializeBigInt(userWithoutPassword);
    }

    async createUser(user: CreateUserDto) {
        const userExists = await prisma.user.findUnique({
            where: {
                email: user.email,
            }
        });

        if (userExists) {
            throw new CustomError(STATUS_CODES.Conflict, "User already exists.");
        }

        const {
            first_name,
            last_name,
            email,
            password,
            address_line1,
            address_line2,
            city,
            state,
            country,
            pincode
        } = user;

        const newUser = await prisma.user.create({
            data: {
                first_name,
                last_name,
                email,
                password,
                address: {
                    create: {
                        address_line1,
                        address_line2,
                        city,
                        state,
                        country,
                        pincode
                    }
                }
            },
            include: {
                address: true
            }
        });

        console.log(newUser)

        const { password: _, ...userWithoutPassword } = newUser;

        return serializeBigInt(userWithoutPassword)
    }
}

export default UserRepository;