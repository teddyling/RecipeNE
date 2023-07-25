import { NotAuthorizedError } from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../model/user";

const router = express.Router();

// Admin route

router.get(
  "/api/v1/users",
  async (req: Request, res: Response, next: NextFunction) => {
    // if (!req.currentUser || req.currentUser.role !== "admin") {
    //   throw new NotAuthorizedError();
    // }

    const users = await User.find();
    res.status(200).send({
      data: users,
    });
  }
);

export { router as getAllUsersRouter };
