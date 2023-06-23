import {
  NotAuthorizedError,
  addAuthHeader,
  ensureLogin,
} from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../model/user";

const router = express.Router();

router.post(
  "/api/v1/users/signout",
  addAuthHeader,
  ensureLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const user = await User.findById(req.currentUser.id);
      if (!user) {
        throw new NotAuthorizedError();
      }
      req.session = null;
      res.clearCookie("resetToken", { path: "/api/v1" });
      user.refreshToken = undefined;
      res.status(204).send(null);
    } catch (err) {
      next(err);
    }
  }
);

export { router as signoutRouter };
