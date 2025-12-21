
import { prisma } from "../../shared/prisma";
import { IUserPayload, IUpdateUserProfile } from "./user.interface";

const getMyProfile = async (user: IUserPayload) => {
  const result = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePhoto: true,
      bio: true,
      languages: true,
      guideProfile: true,
    },
  });

  return result;
};

const updateMyProfile = async (
  user: IUserPayload,
  payload: IUpdateUserProfile
) => {
  const result = await prisma.user.update({
    where: { id: user.id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profilePhoto: true,
      bio: true,
      languages: true,
    },
  });

  return result;
};

const getUserById = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
      profilePhoto: true,
      bio: true,
      languages: true,
      guideProfile: true,
      listings: true,
      reviews: true,
    },
  });

  return result;
};
export const UserService = {
  getMyProfile,
  updateMyProfile,
  getUserById,
}
