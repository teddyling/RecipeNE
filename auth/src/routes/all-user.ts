import { NotAuthorizedError } from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../model/user";

const router = express.Router();

router.get(
  "/api/v1/users",
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser || req.currentUser.role !== "admin") {
      throw new NotAuthorizedError();
    }

    const users = User.find();
    res.status(200).send({
      data: users,
    });
  }
);
