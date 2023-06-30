import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../model/user";
import {
  ResourceNotFoundError,
  RequestValidationError,
  rateLimitMiddleware,
} from "@dongbei/utilities";

const router = express.Router();

router.patch(
  "/api/v1/users/resetpassword/:token",
  [
    rateLimitMiddleware,

    body("password")
      .exists()
      .notEmpty()
      .trim()
      .isLength({ max: 20, min: 8 })
      .withMessage("Password must be between 8-20 characters")
      .custom((value: string) => {
        const upper = /[A-Z]/.test(value);
        const lower = /[a-z]/.test(value);
        const number = /[0-9]/.test(value);
        return upper && lower && number;
      })
      .withMessage(
        "Password must contain uppercase letters, lowercase letters, and numbers"
      ),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      const providedToken = req.params.token;
      const hashedToken = crypto
        .createHash("sha256")
        .update(providedToken)
        .digest("hex");
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new ResourceNotFoundError();
      }
      user.password = req.body.password;
      user.passwordResetExpires = undefined;
      user.passwordResetToken = undefined;
      user.refreshToken = undefined;
      await user.save();

      res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  }
);

export { router as resetPasswordRouter };
