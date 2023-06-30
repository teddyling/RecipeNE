import {
  NotAuthorizedError,
  BadRequestError,
  ResourceNotFoundError,
} from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Comment } from "../model/comment";

const router = express.Router();

router.delete(
  "/api/v1/comments/:commentId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser || req.currentUser.role !== "admin") {
        throw new NotAuthorizedError();
      }
      const { commentId } = req.params;
      if (!mongoose.isValidObjectId(commentId)) {
        throw new BadRequestError("Invalid comment ID");
      }

      if (!req.body.comment) {
        throw new BadRequestError("No updated comment provided");
      }

      const comment = await Comment.findByIdAndDelete(commentId);
      if (!comment) {
        throw new ResourceNotFoundError();
      }

      res.status(204).send(null);
    } catch (err) {
      return next(err);
    }
  }
);
