import { Request, Response } from "express";
import { UserService } from "./user.service";


const getMyProfile = async (req: Request, res: Response) => {
  const result = await UserService.getMyProfile(req.user!);

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
};

const updateMyProfile = async (req: Request, res: Response) => {
  const result = await UserService.updateMyProfile(req.user!, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
};

const getUserById = async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
};

export const UserController = {
  getMyProfile,
  updateMyProfile,
  getUserById,
}
