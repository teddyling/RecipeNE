import express, { NextFunction, Request, Response } from "express";
import { Recipe } from "../models/recipe";

const router = express.Router();

router.get(
  "/api/v1/recipes",
  async (req: Request, res: Response, next: NextFunction) => {
    const recipes = await Recipe.find();
    try {
      res.status(200).send({
        status: "success",
        data: {
          recipe: recipes,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as getAllRecipeRouter };
