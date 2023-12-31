import {
  NotAuthorizedError,
  ResourceNotFoundError,
  addAuthHeader,
  ensureLogin,
  rateLimitMiddleware,
} from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../model/user";
import { Comment } from "../model/comment";

const router = express.Router();

// Only login user can see his/her own comments

router.get(
  "/api/v1/comments/mycomments",
  // addAuthHeader,
  ensureLogin,
  rateLimitMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const { id: userId } = req.currentUser;
      const user = await User.findById(userId);
      if (!user) {
        throw new ResourceNotFoundError();
      }

      const comments = await Comment.find({ user: user.id }).populate("recipe");
      res.status(200).send({
        comments,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as allMyCommentRouter };
