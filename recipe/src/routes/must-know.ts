import express, { NextFunction, Request, Response } from "express";
import { applyAPIFeature } from "./all-recipe";
import { rateLimitMiddleware } from "@dongbei/utilities";

const router = express.Router();

// router.get('/api/v1/recipes/must-know', (req: Request, res: Response, next: NextFunction) => {
//   req.query.must_know = "true";
//   next();
// })

const getAllMustKnow = (req: Request, res: Response, next: NextFunction) => {
  req.query.must_know = "true";
  next();
};

router.get(
  "/api/v1/recipes/must-know",
  getAllMustKnow,
  rateLimitMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = applyAPIFeature(req);
      const recipes = await query;
      const returnedRecipes = recipes.map((recipe) => {
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
        recipes: returnedRecipes,
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as mustKnowRouter };
