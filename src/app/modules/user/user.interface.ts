import { Role } from "@prisma/client";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  profilePhoto?: string | null;
  createdAt: Date;
}

export interface IUpdateUser {
  name?: string;
  bio?: string;
  profilePhoto?: string;
  languages?: string[];
}

