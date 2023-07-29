import express, { NextFunction, Request, Response } from "express";
import { Recipe } from "../models/recipe";
import { rateLimitMiddleware } from "@dongbei/utilities";

const router = express.Router();

const applyAPIFeature = (req: Request) => {
  const queryObj = { ...req.query };
  // Regular filter
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((ele) => delete queryObj[ele]);

  // Advance filter, add greater than (equal) and less than (equal)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Recipe.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    query = query.sort(req.query.sort as string);
  }

  // Field Limiting
  if (req.query.fields) {
    const fields = (req.query.fields as string).split(",").join(" ");
    query = query.select(fields);
  }
  return query;
};

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
export { applyAPIFeature };
export { router as getAllRecipeRouter };
