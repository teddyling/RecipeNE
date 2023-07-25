import { addAuthHeader, ensureLogin } from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get(
  "/api/v1/users/currentuser",
  ensureLogin,
  (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.session);
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
