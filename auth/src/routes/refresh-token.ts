import { NotAuthorizedError, NotFoundError } from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyJWT } from "@dongbei/utilities";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import e from "express";
import { User } from "../model/user";
import { RefreshToken } from "../service/RefreshToken";

const router = express.Router();

router.post(
  "/api/v1/users/refresh-token",
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.signedCookies.resetToken;

    try {
      const result = await verifyJWT(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      );
      if (result instanceof JsonWebTokenError) {
        throw new NotAuthorizedError("Not authorized. Invalid token");
      }

      const user = await User.findById(result.id);
      if (!user) {
        throw new NotFoundError("Did not find user asking refresh token");
      }

      const compareResult = RefreshToken.compare(
        user.refreshToken!,
        refreshToken
      );
      if (!compareResult) {
        throw new NotAuthorizedError("Incorrect Refresh Token");
      }

      const newToken = jwt.sign(
        {
          id: user.id,
          role: user.role,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1m",
        }
      );
      console.log("Token refreshed successfully!");

      res.status(200).send({
        jwt: newToken,
        user: {
          id: user.id,
          role: user.role,
          email: user.email,
          username: user.username,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as refreshTokenRouter };
