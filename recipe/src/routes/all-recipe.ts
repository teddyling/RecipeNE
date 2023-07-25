import express, { NextFunction, Request, Response } from "express";
import { Recipe } from "../models/recipe";
// import { BadRequestError } from "../../utilities/errors/bad-request-error";
// import { NotFoundError } from "../../utilities/errors/not-found-error";
import { applyAPIFeature } from "../utilities/functions/apply-api-features";
import { rateLimitMiddleware } from "@dongbei/utilities";

const router = express.Router();

router.get(
  "/api/v1/recipes",
  rateLimitMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query = applyAPIFeature(req);

      const recipes = await query;
      const recipeCount = recipes.length;

      // Pagination
      let page = 1;
      if (req.query.page) {
        page = +req.query.page;
      }
      let limit = 12;
      if (req.query.limit) {
        limit = +req.query.limit;
      }
      let skip = (page - 1) * limit;

      if (skip >= (await Recipe.countDocuments())) {
        skip = 0;
      }
      query = query.skip(skip).limit(limit);
      const pagedRecipe = await query.clone();

      const returnedRecipes = pagedRecipe.map((recipe) => {
        return {
          title: recipe.title,
          popularity: recipe.popularity,
          difficulity: recipe.difficulity,
          category: recipe.category,
          id: recipe.id,
          slug: recipe.slug,
          image: recipe.image,
          type: recipe.type,
        };
      });

      res.status(200).send({
        page: req.query.page ? +req.query.page : 1,
        length: recipeCount,
        recipes: returnedRecipes,
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as getAllRecipeRouter };
