import express, { Request, Response, NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { verifyJWT } from "../utilities/functions/verify-jwt";
import { NotAuthorizedError } from "@dongbei/utilities";
import { User } from "../model/user";

const router = express.Router();

router.get(
  "/api/v1/users/verify",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization!.split(" ")[1];

      const result = await verifyJWT(token, process.env.JWT_SECRET!);
      if (result instanceof JsonWebTokenError) {
        throw new NotAuthorizedError("Not authorized. Invalid token");
      }
      const user = await User.findById(result.id);
      if (!user) {
        return res.send({
          status: "fail",
          errorMessage: "Not Authorized, User does not exist",
        });
      }
      if (user.changedPasswordAfterJwt(result.iat!)) {
        return res.send({
          status: "fail",
          errorMessage: "Not Authorized, Token expired",
        });
      }
      return res.send({
        status: "success",
        data: {
          currentUser: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
          },
        },
      });
    } catch (err) {
      console.log(err);

      if (err instanceof JsonWebTokenError) {
        return res.send({
          status: "fail",
          errorMessage: `Not Authorized, ${err.message}`,
        });
      }
      return res.send({
        error: err,
      });
    }
  }
);

export { router as verifyJwtRouter };
