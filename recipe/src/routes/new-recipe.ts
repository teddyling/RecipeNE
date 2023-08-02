import express, { NextFunction, Request, Response } from "express";
import { Recipe } from "../models/recipe";
import { Category } from "../models/recipe-category";

import {
  ResourceNotFoundError,
  addAuthHeader,
  ensureAdmin,
  ensureLogin,
  doubleCsrfUtilities,
} from "@dongbei/utilities";
import { RecipeCreatedPublisher } from "../events/recipe-created-publisher";
import { natsWrapper } from "../nats-wrapper";

// This route is admin only route
const router = express.Router();
const { doubleCsrfProtection } = doubleCsrfUtilities;

router.post(
  "/api/v1/recipes",
  ensureLogin,
  ensureAdmin,
  // doubleCsrfProtection,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipe = Recipe.build(req.body);

      const savedRecipe = await recipe.save();

      await new RecipeCreatedPublisher(natsWrapper.client).publish({
        id: savedRecipe.id,
        title: savedRecipe.title,
      });

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
