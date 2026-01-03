import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import httpStatus from "http-status";
import config from "../../../config";

// Helper for local development vs production cookies
const isProduction = config.node_env === "production";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const registerAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerAdmin(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  const { accessToken, refreshToken } = result;

  // Set Cookies
  res.cookie("accessToken", accessToken, {
    secure: isProduction, // false on localhost
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax", // lax for localhost
    maxAge: 1000 * 60 * 60, // 1 hour
  });

  res.cookie("refreshToken", refreshToken, {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: { accessToken, refreshToken }, // Usually good to return tokens in body too
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken: oldRefreshToken } = req.cookies;
  const result = await AuthService.refreshToken(oldRefreshToken);

  res.cookie("accessToken", result.accessToken, {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully!",
    data: result,
  });
});

export const AuthController = {
  login,
  registerAdmin,
  registerUser,
  refreshToken,
};