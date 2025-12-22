import { z } from "zod";

const createListingValidation = z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    city: z.string(),
    category: z.string(),
    price: z.number().positive(),
    duration: z.number().positive(),
    meetingPoint: z.string(),
    maxGroup: z.number().int().positive(),
    guideId: z.string().uuid(),
    images: z.array(z.string().url()).optional()
});

const updateListingSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        city: z.string().optional(),
        category: z.string().optional(),
        price: z.number().optional(),
        duration: z.number().optional(),
        meetingPoint: z.string().optional(),
        maxGroup: z.number().optional(),
        images: z.array(z.string()).optional(),
        isActive: z.boolean().optional()
    })
});
export const ListingValidation = {
    createListingSchema: createListingValidation,
    updateListingSchema: updateListingSchema
};
