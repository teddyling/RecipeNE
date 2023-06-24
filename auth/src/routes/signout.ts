import {
  NotAuthorizedError,
  addAuthHeader,
  ensureLogin,
  client,
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

      const suspendedJwt = req.session!.jwt;
      const invalidMiliSecond = req.currentUser.exp! * 1000 - Date.now();
      await client.set(suspendedJwt, 1, {
        PX: invalidMiliSecond + 1000,
      });

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
