import mongoose from "mongoose";
import {
  NotAuthorizedError,
  BadRequestError,
  ResourceNotFoundError,
  addAuthHeader,
  ensureLogin,
  rateLimitMiddleware,
} from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import { Comment } from "../model/comment";

const router = express.Router();

router.delete(
  "/api/v1/comments/mycomments/:commentId",
  addAuthHeader,
  ensureLogin,
  rateLimitMiddleware,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const { commentId } = req.params;
      if (!mongoose.isValidObjectId(commentId)) {
        throw new BadRequestError("Invalid comment ID");
      }

      const comment = await Comment.findOneAndDelete({
        id: commentId,
        user: req.currentUser.id,
      });

      if (!comment) {
        throw new ResourceNotFoundError();
      }
      res.status(204).send(null);
    } catch (err) {
      return next(err);
    }
  }
);
