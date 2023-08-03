import express, { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import { ResourceNotFoundError } from "@dongbei/utilities";
import { doubleCsrfUtilities } from "@dongbei/utilities";
import { natsWrapper } from "../service/nats-wrapper";
import { UserCreatedPublisher } from "../events/user-created-publisher";

const router = express.Router();

router.get(
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
      await new UserCreatedPublisher(natsWrapper.client).publish({
        id: user.id,
        role: user.role,
        username: user.username,
      });

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "30m",
        }
      );

      req.session = {
        jwt: token,
        // refreshToken,
      };

      res.cookie("resetToken", refreshToken, {
        httpOnly: true,
        signed: true,
        // path: "/api/v1",
        secure: true,
        sameSite: "lax",
      });

      const { generateToken } = doubleCsrfUtilities;
      const csrfToken = generateToken(res, req);
      res.redirect("/redirect/signup");

      // res.status(200).send({ token, csrfToken });
    } catch (err) {
      next(err);
    }
  }
);

export { router as verifyEmailRouter };
