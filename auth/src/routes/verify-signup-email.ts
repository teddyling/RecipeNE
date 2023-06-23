import express, { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import { ResourceNotFoundError } from "@dongbei/utilities";

const router = express.Router();

router.patch(
  "/api/v1/users/verifysignup/:token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const verifyToken = req.params.token;
      const hashedToken = crypto
        .createHash("sha256")
        .update(verifyToken)
        .digest("hex");

      const user = await User.findOne({
        emailVerifyToken: hashedToken,
        emailVerifyTokenExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new ResourceNotFoundError();
      }

      user.verify = true;
      user.emailVerifyToken = undefined;
      user.emailVerifyTokenExpires = undefined;

      const refreshToken = await user.createRefreshToken(user.id);

      await user.save();

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "10m",
        }
      );

      req.session = {
        jwt: token,
      };

      res.cookie("resetToken", refreshToken, {
        httpOnly: true,
        signed: true,
        path: "/api/v1",
        secure: false,
      });

      res.status(200).send({ token });
    } catch (err) {
      next(err);
    }
  }
);

export { router as verifyEmailRouter };
