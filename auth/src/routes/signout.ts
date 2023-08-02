import {
  NotAuthorizedError,
  addAuthHeader,
  ensureLogin,
  client,
} from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../model/user";
import { doubleCsrfUtilities } from "@dongbei/utilities";

const router = express.Router();
const { doubleCsrfProtection } = doubleCsrfUtilities;

router.post(
  "/api/v1/users/signout",
  ensureLogin,
  // doubleCsrfProtection,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const user = await User.findById(req.currentUser.id);
      if (!user) {
        throw new NotAuthorizedError();
      }
      user.refreshToken = undefined;
      await user.save();

      const suspendedJwt = req.session!.jwt;
      const invalidMiliSecond = req.currentUser.exp! * 1000 - Date.now();
      await client.v4.set(suspendedJwt, 1, {
        PX: invalidMiliSecond + 1000,
      });

      req.session = null;
      res.clearCookie("resetToken");
      res.clearCookie("csrf-token");

      res.status(204).send(null);
    } catch (err) {
      next(err);
    }
  }
);

export { router as signoutRouter };
