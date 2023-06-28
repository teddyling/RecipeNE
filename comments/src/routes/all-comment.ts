import {
  NotAuthorizedError,
  addAuthHeader,
  ensureLogin,
} from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import { Comment } from "../model/comment";

const router = express.Router();

// Only admins can get all comments
router.get(
  "/api/v1/comments",
  addAuthHeader,
  ensureLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const comments = await Comment.find();
      res.status(200).send({
        data: {
          comments,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as allCommentRouter };
