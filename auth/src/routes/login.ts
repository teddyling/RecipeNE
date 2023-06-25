import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  NotAuthorizedError,
  doubleCsrfUtilities,
} from "@dongbei/utilities";
import { User } from "../model/user";
//import { BadRequestError } from "../../utilities/errors/bad-request-error";
//import { RequestValidationError } from "../../utilities/errors/request-validation-error";

import { RequestValidationError } from "@dongbei/utilities";
import { Password } from "../service/Password";
// import { ensureLogin } from "../utilities/middlewares/ensureLogin";

const router = express.Router();

router.post(
  "/api/v1/users/login",
  [
    body("email")
      .exists()
      .notEmpty()
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .exists()
      .notEmpty()
      .withMessage("A password must be supplied"),
  ],
  // ensureLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new NotAuthorizedError("Invalid Credentials");
      }
      const correctPassword = await Password.compare(
        existingUser.password,
        password
      );
      if (!correctPassword) {
        throw new NotAuthorizedError("Invalid Credentials");
      }

      const refreshToken = existingUser.createRefreshToken(existingUser.id);
      await existingUser.save();

      const token = jwt.sign(
        {
          id: existingUser.id,
          role: existingUser.role,
          email: existingUser.email,
          username: existingUser.username,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "10m",
        }
      );

      //console.log(req.session?.jwt);

      req.session = {
        jwt: token,
      };

      res.cookie("resetToken", refreshToken, {
        httpOnly: true,
        signed: true,
        path: "/api/v1",
        secure: false,
        sameSite: "lax",
      });

      const { generateToken } = doubleCsrfUtilities;
      const csrfToken = generateToken(res, req);

      res.status(200).send({
        data: existingUser,
        token: token,
        csrfToken,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as loginRouter };
