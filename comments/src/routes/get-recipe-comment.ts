import express, { Request, Response, NextFunction } from "express";
import { Comment } from "../model/comment";
import { Recipe } from "../model/recipe";
import { ResourceNotFoundError } from "@dongbei/utilities";

const router = express.Router();

router.get(
  "/api/v1/comments/:recipeId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recipeId } = req.params;
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        throw new ResourceNotFoundError();
      }
      const comments = await Comment.find({ recipe: recipeId }).populate(
        "user"
      );
      if (!comments) {
        return res.send({ comments: null });
      }
      res.status(200).send({
        comments,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as getCommentsByRecipeRouter };
