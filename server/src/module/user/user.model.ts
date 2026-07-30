import { User } from "@prisma/client";
import { Address } from "../../../prisma/generated/client";

export interface CreateUserDto {
    // User Info
    first_name: string;
    last_name: string;
    email: string;
    password: string;

    // Address Info
    address_line1: string;
    address_line2: string;
    city: string;
    state: string
    country: string;
    pincode: string;
}



export const serializeBigInt = (data: unknown) =>
    JSON.parse(
        JSON.stringify(data, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );