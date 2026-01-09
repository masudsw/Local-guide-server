
import { Prisma, Role } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { IUserPayload, IUpdateUserProfile } from "./user.interface";
import { fileUploader } from "../../helper/fileUploader";
import { IPaginationOptions } from "../../interface/IPaginationOptions";
import { paginationHelper } from "../../helper/paginationHelper";
import { userSearchAbleFields } from "./user.constant";

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
  payload: IUpdateUserProfile,
  file?: Express.Multer.File
) => {
  const { expertise, dailyRate, ...userData } = payload;
  let profilePhoto: string | undefined;

  if (file) {
    // 1. Find the current user to get the old photo URL
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { profilePhoto: true }
    });

    if (currentUser?.profilePhoto) {

      const publicId = currentUser.profilePhoto.split("/").pop()?.split(".")[0];

      if (publicId) {
        await fileUploader.deleteFromCloudinary(publicId);
      }
    }

    // 3. Upload the new photo
    const uploadResult = await fileUploader.uploadToCloudinary(file);

    profilePhoto = uploadResult?.secure_url;
  }

  // 4. Update the database
  const result = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...userData,
      ...(profilePhoto && { profilePhoto }),
      guideProfile: user.role === Role.GUIDE
        ? {
          update: {
            expertise: expertise,
            dailyRate: dailyRate ? Number(dailyRate) : undefined,
          },
        }
        : undefined,
    },
    include: { guideProfile: true },
  });

  return result;
};

const getAllUsers = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (params.searchTerm) {
        andConditions.push({
            OR: userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            
            status: true,
            createdAt: true,
            updatedAt: true,
            
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
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
        Listing: true,
        Review: true,
      },
    });

    return result;
  };
  export const UserService = {
    getMyProfile,
    updateMyProfile,
    getUserById,
    getAllUsers
  }
