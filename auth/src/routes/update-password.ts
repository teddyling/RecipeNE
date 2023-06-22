import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import { Password } from "../service/Password";
import {
  NotAuthorizedError,
  ResourceNotFoundError,
  RequestValidationError,
  ensureLogin,
} from "@dongbei/utilities";

const router = express.Router();

router.patch(
  "/api/v1/users/updatepassword",
  ensureLogin,
  body("newPassword")
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
  ensureLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const { id } = req.currentUser;
      const user = await User.findById(id);
      if (!user) {
        throw new ResourceNotFoundError();
      }
      const { oldPassword, newPassword } = req.body;
      const comparePasswordResult = await Password.compare(
        user.password,
        oldPassword
      );
      if (!comparePasswordResult) {
        throw new NotAuthorizedError("The input previous password is wrong.");
      }
      user.password = newPassword;
      await user.save();

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "20m",
        }
      );
      res.send({ token });
    } catch (err) {
      next(err);
    }
  }
);

export { router as updatePasswordRouter };
