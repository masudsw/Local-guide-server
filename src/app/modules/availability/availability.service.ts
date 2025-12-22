
import { prisma } from "../../shared/prisma";
import { ICreateAvailability } from "./availability.interface";

const createAvailability = async (
  guideId: string,
  payload: ICreateAvailability
) => {
  const { date, dayOfWeek, startTime, endTime } = payload;
  const targetDate = date ? new Date(date) : null;

  // 1. Check for Conflicts (Duplicates + Overlaps)
  const conflict = await prisma.guideAvailability.findFirst({
    where: {
      guideId,
      // Check for the same specific date OR the same recurring day
      OR: [
        ...(targetDate ? [{ date: targetDate }] : []),
        ...(dayOfWeek ? [{ dayOfWeek }] : []),
      ],
      // Overlap Logic: (StartA < EndB) AND (EndA > StartB)
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
  });

  if (conflict) {
    // Determine if it was an exact duplicate or just an overlap for the error message
    const isDuplicate = conflict.startTime === startTime && conflict.endTime === endTime;
    throw new Error(
      isDuplicate 
        ? "This exact availability slot already exists." 
        : "The time slot overlaps with an existing availability."
    );
  }

  // 2. Create the entry if no conflict is found
  return prisma.guideAvailability.create({
    data: {
      guideId,
      date: targetDate,
      dayOfWeek: dayOfWeek ?? null,
      startTime,
      endTime,
    },
  });
};

const getMyAvailability = async (guideId: string) => {
  return prisma.guideAvailability.findMany({
    where: { guideId },
    orderBy: [{ date: "asc" }],
  });
};

const getGuideAvailability = async (guideId: string) => {
  return prisma.guideAvailability.findMany({
    where: {
      guideId,
      isBooked: false,
    },
    orderBy: [{ date: "asc" }],
  });
};

const deleteAvailability = async (
  availabilityId: string,
  guideId: string
) => {
  return prisma.guideAvailability.deleteMany({
    where: {
      id: availabilityId,
      guideId,
      isBooked: false,
    },
  });
};
export const AvailabilityService={
    createAvailability,
    getMyAvailability,
    getGuideAvailability,
    deleteAvailability
}
