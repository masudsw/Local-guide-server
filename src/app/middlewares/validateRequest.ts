// import { NextFunction, Request, Response } from "express";
// import { ZodObject } from "zod";

// const validateRequest = (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await schema.parseAsync({
//             body: req.body
//         })
//         return next()

//     } catch (error) {
//         next(error)
//     }
// }
// export default validateRequest;

import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod'; // Import the base ZodType

const validateRequest = (schema: ZodType<any, any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;