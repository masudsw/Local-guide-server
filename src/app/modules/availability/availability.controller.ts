import { Request, Response } from "express";
import { AvailabilityService } from "./availability.service";


const createAvailability = async (req: Request, res: Response) => {
    console.log("------------",req.body)
  const result = await AvailabilityService.createAvailability(
    req.user!.id,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Availability created successfully",
    data: result,
  });
};

const getMyAvailability = async (req: Request, res: Response) => {
  const result = await AvailabilityService.getMyAvailability(req.user!.id);

  res.status(200).json({
    success: true,
    data: result,
  });
};

const getGuideAvailability = async (req: Request, res: Response) => {
  const result = await AvailabilityService.getGuideAvailability(
    req.params.guideId
  );

  res.status(200).json({
    success: true,
    data: result,
  });
};

 const deleteAvailability = async (req: Request, res: Response) => {
  await AvailabilityService.deleteAvailability(
    req.params.id,
    req.user!.id
  );

  res.status(200).json({
    success: true,
    message: "Availability deleted",
  });
};

export const AvailabilityController = {
  createAvailability,
  getMyAvailability,
  getGuideAvailability,
  deleteAvailability,
}