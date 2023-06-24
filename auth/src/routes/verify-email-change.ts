import express, { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { User } from "../model/user";

import {
  BadRequestError,
  NotAuthorizedError,
  ResourceNotFoundError,
  addAuthHeader,
  ensureLogin,
  client,
} from "@dongbei/utilities";
import jwt from "jsonwebtoken";

const router = express.Router();

router.patch(
  "/api/v1/users/verifyemail/:token",
  addAuthHeader,
  ensureLogin,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const changeEmailtoken = req.params.token;
      const hashedToken = crypto
        .createHash("sha256")
        .update(changeEmailtoken)
        .digest("hex");

      const user = await User.findOne({
        changedEmailToken: hashedToken,
        changedEmailExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new ResourceNotFoundError();
      }
      if (!user.changedEmail) {
        throw new BadRequestError(
          "No email changing operation was made before"
        );
      }
      user.email = user.changedEmail;
      user.changedEmail = undefined;
      user.changedEmailExpires = undefined;
      user.changedEmailToken = undefined;
      user.refreshToken = undefined;
      await user.save();

      const suspendedJwt = req.session!.jwt;
      const invalidMiliSecond = req.currentUser.exp! * 1000 - Date.now();
      await client.set(suspendedJwt, 1, {
        PX: invalidMiliSecond + 1000,
      });

      req.session = null;
      res.clearCookie("resetToken", { path: "/api/v1" });
      res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  }
);

export { router as verifyEmailChangeRouter };
