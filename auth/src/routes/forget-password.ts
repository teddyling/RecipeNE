import express, { NextFunction, Request, Response } from "express";
import { User } from "../model/user";
import { body, validationResult } from "express-validator";
import {
  BadRequestError,
  ResourceNotFoundError,
  ServerInternalError,
  RequestValidationError,
  rateLimitMiddleware,
} from "@dongbei/utilities";
import { sendEmail } from "@dongbei/utilities";
const router = express.Router();

router.post(
  "/api/v1/users/forgetpassword",
  [
    rateLimitMiddleware,

    body("email")
      .exists()
      .notEmpty()
      .isEmail()
      .withMessage("Please provide a valid email"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      if (!req.body.email) {
        throw new BadRequestError("No user email provided");
      }
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new ResourceNotFoundError();
      }
      const resetToken = user.createResetPasswordToken();

      await user.save();

      const resetURL = `${req.protocol}://authenticdongbei.com/api/v1/users/resetpassword/${resetToken}`;
      const emailSubject = `Your password reset token (valid for 10 min)`;
      const content = `Send an post request to ${resetURL} to reset your password`;
      try {
        await sendEmail(user.email, emailSubject, content);
      } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return next(new ServerInternalError("Failed sending email."));
      }
      res.status(200).send(user);
      //res.status(204).send({});
    } catch (err) {
      return next(err);
    }
  }
);

export { router as forgetPasswordRouter };
