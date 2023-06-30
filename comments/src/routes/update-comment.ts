import mongoose from "mongoose";
import {
  NotAuthorizedError,
  BadRequestError,
  ResourceNotFoundError,
  addAuthHeader,
  ensureLogin,
  ensureAdmin,
} from "@dongbei/utilities";
import express, { Request, Response, NextFunction, response } from "express";
import { Comment } from "../model/comment";

const router = express.Router();

router.patch(
  "/api/v1/comments/:commentId",
  addAuthHeader,
  ensureLogin,
  ensureAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
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

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new ResourceNotFoundError();
    }

    comment.content = req.body.comment;
    await comment.save();
    res.status(200).send({
      data: {
        comment,
      },
    });
  }
);
