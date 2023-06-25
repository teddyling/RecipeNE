import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import {
  NotAuthorizedError,
  RequestValidationError,
  BadRequestError,
  ResourceNotFoundError,
  ServerInternalError,
  sendEmail,
  addAuthHeader,
  ensureLogin,
  doubleCsrfUtilities,
} from "@dongbei/utilities";
import { User } from "../model/user";
const router = express.Router();
const { doubleCsrfProtection } = doubleCsrfUtilities;

router.patch(
  "/api/v1/users/updatemyemail",
  doubleCsrfProtection,
  addAuthHeader,
  ensureLogin,
  [
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
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      if (req.body.password || req.body.username) {
        throw new BadRequestError("Wrong route for attempted operation");
      }
      const newEmail = req.body.email;
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser) {
        throw new BadRequestError("The email is already in use!");
      }

      const user = await User.findById(req.currentUser.id);
      if (!user) {
        throw new ResourceNotFoundError();
      }
      user.changedEmail = newEmail;
      const emailChangeToken = user.createChangeEmailToken();
      await user.save();

      const resetURL = `${req.protocol}://authenticdongbei.com/api/v1/users/verifyemail/${emailChangeToken}`;
      const emailSubject = `Your email change token (valid for 10 min)`;
      const content = `Send an email to ${resetURL} to reset your password`;

      const warningEmailSubject = `Account Change Notification`;
      const warningContent = `There have been some recent changes to your account: 
    The email address for the account has been updated. 
    
    If you recently made account changes, you can ignore this notification. 
    If you have not made any changes, it is strongly recommended that you update your password as soon as possible to ensure account security.
    `;
      try {
        await sendEmail(user.changedEmail!, emailSubject, content);
        await sendEmail(user.email, warningEmailSubject, warningContent);
      } catch (error) {
        user.changedEmail = undefined;
        user.changedEmailExpires = undefined;
        user.changedEmailToken = undefined;
        await user.save();
        return next(new ServerInternalError("Failed sending email."));
      }
      res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  }
);

export { router as updateMyEmailRouter };
