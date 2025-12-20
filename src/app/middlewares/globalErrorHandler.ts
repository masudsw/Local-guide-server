import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let errorSources: any = err;

    // 1. Handle Zod Validation Errors
    if (err instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Zod Validation Error";
        // Map through Zod issues to create a readable array
        errorSources = err.issues.map((issue) => {
            return {
                path: issue.path[issue.path.length - 1], // gets the field name
                message: issue.message,
            };
        });
    } 
    // 2. Handle Prisma Known Request Errors (P2002, etc.)
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpStatus.CONFLICT;
            message = "Duplicate key error";
            errorSources = err.meta;
        } else if (err.code === "P1000") {
            statusCode = httpStatus.BAD_GATEWAY;
            message = "Authentication failed against database service";
            errorSources = err.meta;
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            message = "Foreign key constraint failed";
            errorSources = err.meta;
        }
    } 
    // 3. Handle Other Prisma Errors
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Database Validation error";
        errorSources = err.message;
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Database connection failed";
        errorSources = err.message;
    }

    // Final Response Structure
    res.status(statusCode).json({
        success,
        message,
        errorSources, // This will be the clean array for Zod or meta for Prisma
        // Only show full stack trace in development mode
        stack: process.env.NODE_ENV === 'development' ? err?.stack : null,
    });
};

export default globalErrorHandler;