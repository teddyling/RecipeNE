import express, { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { User } from "../model/user";
import { BadRequestError, ResourceNotFoundError } from "@dongbei/utilities";
import jwt from "jsonwebtoken";

const router = express.Router();

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

      await user.save();

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "20m",
        }
      );
      res.status(200).send({ token });
    } catch (err) {
      next(err);
    }
  }
);

export { router as verifyEmailChangeRouter };
