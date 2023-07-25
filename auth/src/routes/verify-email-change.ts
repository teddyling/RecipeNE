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
  doubleCsrfUtilities,
} from "@dongbei/utilities";
import jwt from "jsonwebtoken";

const router = express.Router();
const { doubleCsrfProtection } = doubleCsrfUtilities;

router.get(
  "/api/v1/users/verifyemail/:token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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
      res.redirect("/redirect/update-email");
    } catch (err) {
      next(err);
    }
  }
);

export { router as verifyEmailChangeRouter };
