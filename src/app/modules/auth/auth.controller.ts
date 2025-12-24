import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";



const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const registerAdmin = async (req: Request, res: Response) => {
  const result = await AuthService.registerAdmin(req);
  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: result,
  });
};


const login = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60
    })
    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60
    })
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User logged in successfully",
      data: null
    })
  }
)

export const AuthController = {
  login,
  registerAdmin,
  registerUser
}