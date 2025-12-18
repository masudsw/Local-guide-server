import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";



const getAllFromDB = async (filters: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialities, ...filterData } = filters;
    const andConditions: Prisma.DoctorWhereInput[] = [];
    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })

    }

    if (specialities && specialities.length > 0) {
        andConditions.push({
            DoctorSpecilities: {
                some: {
                    specialities: {
                        title: {
                            contains: specialities,
                            mode: "insensitive"
                        }
                    }
                }
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))
        andConditions.push(...filterConditions)
    }
    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            DoctorSpecilities: {
                include: {
                    specialities: true
                }
            }
        }
    });
    const total = await prisma.doctor.count({
        where: whereConditions
    })
    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const updateIntoDB = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });
    const { specialities, ...doctorData } = payload;
    return await prisma.$transaction(async (tnx) => {
        if (specialities && specialities.length > 0) {
            const deleteSpecialityIds = specialities.filter((specility) => specility.isDeleted)
            for (const specility of deleteSpecialityIds) {
                await tnx.doctorSpecilities.deleteMany({
                    where: {
                        doctorId: id,
                        specilitiesId: specility.specialityId
                    }
                })
            }
            const createSpecialityIds = specialities.filter((specility) => !specility.isDeleted)
            for (const specility of createSpecialityIds) {
                await tnx.doctorSpecilities.create({
                    data: {
                        doctorId: id,
                        specilitiesId: specility.specialityId
                    }
                })
            }
        }
        const updateData = await tnx.doctor.update({
            where: {
                id: doctorInfo.id
            },
            data: doctorData,
            include: {
                DoctorSpecilities: {
                    include: {
                        specialities: true
                    }
                }
            }
        })
        return updateData
    })
}

export const DoctorService = {
    getAllFromDB,
    updateIntoDB
}