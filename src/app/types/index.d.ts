import { IUserPayload } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      // Use your custom interface instead of JwtPayload
      user?: IUserPayload; 
    }
  }
}