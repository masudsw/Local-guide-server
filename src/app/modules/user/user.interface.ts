import { Role } from "@prisma/client";

export interface IUserPayload {
  id: string;
  email: string;
  role: Role;
}

export interface IUpdateUserProfile {
  name?: string;
  bio?: string;
  languages?: string[];
  profilePhoto?: string;
}
