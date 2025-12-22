import { z } from "zod";
const createAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  date: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Start time must be in HH:mm format",
  }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "End time must be in HH:mm format",
  }),
})
.refine((data) => data.date || data.dayOfWeek !== undefined, {
  message: "Either date or dayOfWeek must be provided",
  path: ["dayOfWeek"],
})
.refine((data) => {
  const [startH, startM] = data.startTime.split(":").map(Number);
  const [endH, endM] = data.endTime.split(":").map(Number);
  return (startH * 60 + startM) < (endH * 60 + endM);
}, {
  message: "Start time must be before end time",
  path: ["endTime"],
});
const getGuideAvailabilitySchema = z.object({
    params: z.object({
        guideId: z.string().uuid(),
    }),
});
export const AvailabilityValidation = {
    createAvailabilitySchema,
    getGuideAvailabilitySchema,
}