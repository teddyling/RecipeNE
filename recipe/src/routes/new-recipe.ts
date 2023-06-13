import express, { NextFunction, Request, Response } from "express";
import { Recipe } from "../models/recipe";
import { Category } from "../models/recipe-category";
// This route is admin only route
const router = express.Router();

router.post(
  "/api/v1/recipes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipe = Recipe.build(req.body);

      const savedRecipe = await recipe.save();

      res.status(201).send({
        data: {
          recipe: savedRecipe,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as createNewRecipeRouter };
