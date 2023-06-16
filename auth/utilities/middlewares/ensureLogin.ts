import express, { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { promisify } from "util";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { verifyJWT } from "../functions/verify-jwt";
import { User } from "../../src/model/user";

interface UserPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const ensureLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw new NotAuthorizedError();
    }

    const token = req.headers.authorization.split(" ")[1];

    const result = await verifyJWT(token, process.env.JWT_SECRET!);
    if (result instanceof JsonWebTokenError) {
      throw new NotAuthorizedError();
    }

    const user = await User.findById(result.id);
    if (!user) {
      throw new NotAuthorizedError("Not authorized. User does not exist");
    }

    if (user.changedPasswordAfterJwt(result.iat!)) {
      throw new NotAuthorizedError("Token expired, please login again");
    }

    req.currentUser = { id: result.id, role: result.role };
    console.log(req.currentUser);

    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      next(new NotAuthorizedError("Not authorized. Invalid token"));
    }
    next(err);
  }
};

export { ensureLogin };
