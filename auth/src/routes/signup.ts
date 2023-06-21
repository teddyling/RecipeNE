import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../model/user";
// import { BadRequestError } from "../../utilities/errors/bad-request-error";
// import { RequestValidationError } from "../../utilities/errors/request-validation-error";
// import { ensureLogin } from "../../utilities/middlewares/ensureLogin";

import { BadRequestError } from "@dongbei/utilities";
import {
  RequestValidationError,
  ServerInternalError,
} from "@dongbei/utilities";
import { sendEmail } from "@dongbei/utilities";

const router = express.Router();

router.post(
  "/api/v1/users/signup",
  [
    body("email")
      .exists()
      .notEmpty()
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("username")
      .exists()
      .notEmpty()
      .isLength({ max: 20, min: 4 })
      .withMessage("Username must be between 4-20 characters")
      .isAlphanumeric()
      .withMessage("Username contains invalid characters")
      .trim(),

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
      const { username, password, email } = req.body;
      const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail) {
        throw new BadRequestError("The email is already in use!");
      }
      const existingUserUsername = await User.findOne({ username });
      if (existingUserUsername) {
        throw new BadRequestError("The username is already in use!");
      }

      const newUser = User.build({
        username,
        password,
        email,
      });

      const verifyToken = newUser.createEmailVerifyToken();
      await newUser.save();

      const verifyURL = `${req.protocol}://authenticdongbei.com/api/v1/users/verifysignup/${verifyToken}`;
      const emailSubject = `Your account verification token (valid for 30 min)`;
      const content = `Send a get request to ${verifyURL} to reset your password`;
      try {
        await sendEmail(newUser.email, emailSubject, content);
      } catch (error) {
        newUser.emailVerifyToken = undefined;
        newUser.emailVerifyTokenExpires = undefined;
        await newUser.save();
        return next(new ServerInternalError("Failed sending email."));
      }

      // const token = jwt.sign(
      //   {
      //     id: newUser.id,
      //     role: newUser.role,
      //     username: newUser.username,
      //     email: newUser.email,
      //   },
      //   process.env.JWT_SECRET!,
      //   {
      //     expiresIn: "20m",
      //   }
      // );
      res.status(200).send({
        data: {
          user: newUser,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as signupRouter };
