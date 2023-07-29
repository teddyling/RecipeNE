import {
  BadRequestError,
  NotAuthorizedError,
  ResourceNotFoundError,
  RequestValidationError,
  addAuthHeader,
  ensureLogin,
  doubleCsrfUtilities,
  rateLimitMiddleware,
} from "@dongbei/utilities";
import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../model/user";
import { UserUpdatedPublisher } from "../events/user-updated-publisher";
import { natsWrapper } from "../service/nats-wrapper";

const router = express.Router();
const { doubleCsrfProtection } = doubleCsrfUtilities;

router.patch(
  "/api/v1/users/updateme",

  // addAuthHeader,
  ensureLogin,
  rateLimitMiddleware,
  // doubleCsrfProtection,

  body("username")
    .exists()
    .notEmpty()
    .isLength({ max: 20, min: 4 })
    .withMessage("Username must be between 4-20 characters")
    .isAlphanumeric()
    .withMessage("Username contains invalid characters")
    .trim(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      if (req.body.password || req.body.email) {
        throw new BadRequestError("Wrong route for attempted operation");
      }
      const newUsername = req.body.username;
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser) {
        throw new BadRequestError("The username is already in use!");
      }
      const updateUser = await User.findByIdAndUpdate(
        req.currentUser.id,
        { username: newUsername },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updateUser) {
        throw new ResourceNotFoundError();
      }
      await new UserUpdatedPublisher(natsWrapper.client).publish({
        id: req.currentUser.id,
        newUsername,
      });

      res.status(200).send({
        user: updateUser,
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as updateMyUsernameRouter };
