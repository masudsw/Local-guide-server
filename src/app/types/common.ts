import { Role } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export type IJWTPayload={
    email:string;
    role:Role;
}

