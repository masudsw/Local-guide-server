
import { Role } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { IUserPayload, IUpdateUserProfile } from "./user.interface";
import { fileUploader } from "../../helper/fileUploader";

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

    // 2. If an old photo exists, delete it from Cloudinary
    if (currentUser?.profilePhoto) {
      // Extract the public_id from the URL 
      // Example: https://res.cloudinary.com/demo/image/upload/v1/profilePhoto_123.jpg
      // The public_id is "profilePhoto_123"
      const publicId = currentUser.profilePhoto.split("/").pop()?.split(".")[0];
      console.log("publicId-----",publicId)
      
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

// export const updateMyProfile = async (
//   user: IUserPayload,
//   payload: IUpdateUserProfile
// ) => {
//   // 1. Destructure the payload to separate Guide-specific data
//   const { expertise, dailyRate, ...userData } = payload;

//   const result = await prisma.user.update({
//     where: {
//       id: user.id,
//     },
//     data: {
//       // 2. Update standard User fields (name, bio, languages, etc.)
//       ...userData,

//       // 3. Handle Nested Update for GuideProfile
//       guideProfile: user.role === Role.GUIDE 
//         ? {
//             update: {
//               expertise: expertise,
//               dailyRate: dailyRate ? Number(dailyRate) : undefined,
//             },
//           }
//         : undefined,
//     },
//     include: {
//       guideProfile: true, // Returns the guide data in the response
//     },
//   });

//   return result;
// };

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
