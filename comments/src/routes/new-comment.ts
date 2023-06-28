import {
  BadRequestError,
  NotAuthorizedError,
  ResourceNotFoundError,
  addAuthHeader,
  ensureLogin,
} from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../model/user";
import { Recipe } from "../model/recipe";
import { Comment } from "../model/comment";

const router = express.Router();

// Only signed in user can comment

router.post(
  "/api/v1/comments",
  addAuthHeader,
  ensureLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      if (!req.body.recipeId || !req.body.comment) {
        throw new BadRequestError(
          "Please provide the recipe Id you want to comment about"
        );
      }
      const { id: userId } = req.currentUser;
      const user = await User.findById(userId);
      if (!user) {
        throw new ResourceNotFoundError();
      }
      const { recipeId } = req.body;
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        throw new ResourceNotFoundError();
      }

      const comment = Comment.build({
        content: req.body.comment,
        recipe,
        user,
        createdAt: new Date(),
      });

      await comment.save();

      res.status(201).send({
        data: {
          comment: req.body.comment,
          user: user,
          recipe: recipe,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as newCommentRouter };
