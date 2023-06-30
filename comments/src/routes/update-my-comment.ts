import mongoose from "mongoose";
import {
  BadRequestError,
  NotAuthorizedError,
  ResourceNotFoundError,
  ForbiddenError,
  addAuthHeader,
  ensureLogin,
  rateLimitMiddleware,
} from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import { Comment } from "../model/comment";

const router = express.Router();

router.patch(
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

      if (!req.body.comment) {
        throw new BadRequestError("No updated comment provided");
      }

      const comment = await Comment.findOne({
        id: commentId,
        user: req.currentUser.id,
      });

      //const comment = await Comment.findById(commentId).populate("user");
      if (!comment) {
        throw new ResourceNotFoundError();
      }

      // if (comment.user.id !== req.currentUser.id) {
      //   throw new NotAuthorizedError();
      // }

      if (new Date().getTime() - comment.createdAt.getTime() >= 3 * 60 * 1000) {
        throw new ForbiddenError("Cannot update this comment anymore");
      }

      comment.content = req.body.comment;
      await comment.save();

      res.send(200).send({
        data: {
          comment,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);
