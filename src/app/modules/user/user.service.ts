
import { Role } from "@prisma/client";
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

export const updateMyProfile = async (
  user: IUserPayload,
  payload: IUpdateUserProfile
) => {
  // 1. Destructure the payload to separate Guide-specific data
  const { expertise, dailyRate, ...userData } = payload;

  const result = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      // 2. Update standard User fields (name, bio, languages, etc.)
      ...userData,

      // 3. Handle Nested Update for GuideProfile
      guideProfile: user.role === Role.GUIDE 
        ? {
            update: {
              expertise: expertise,
              dailyRate: dailyRate ? Number(dailyRate) : undefined,
            },
          }
        : undefined,
    },
    include: {
      guideProfile: true, // Returns the guide data in the response
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
