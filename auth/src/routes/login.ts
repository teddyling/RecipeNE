import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import { BadRequestError } from "../../utilities/errors/bad-request-error";
import { RequestValidationError } from "../../utilities/errors/request-validation-error";
import { Password } from "../service/Password";

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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new BadRequestError("Invalid Credentials");
      }
      const correctPassword = await Password.compare(
        existingUser.password,
        password
      );
      if (!correctPassword) {
        throw new BadRequestError("Invalid Credentials");
      }
      const token = jwt.sign(
        { id: existingUser.id, role: existingUser.role },
        process.env.JWT_SECRET!,
        {
          expiresIn: "20m",
        }
      );
      res.status(200).send({
        data: existingUser,
        jwt: token,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as loginRouter };
