import express, { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/recipe";
import { NotFoundError, ResourceNotFoundError } from "@dongbei/utilities";

const router = express.Router();

router.get(
  "/api/v1/recipes/s/:slug",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const foundRecipe = await Recipe.findOne({ slug: slug });
      if (!foundRecipe) {
        throw new ResourceNotFoundError();
      }

      res.status(200).send({
        recipe: foundRecipe,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as getOneRecipeBySlugRouter };
