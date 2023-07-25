import { BadRequestError } from "@dongbei/utilities";
import express, { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/recipe";

const router = express.Router();

router.get(
  "/api/v1/recipes/may-also-like",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeNum = await Recipe.count();
      console.log(recipeNum);
      const usedNumbers: number[] = [];

      const fourRandomRecipes = [];
      while (fourRandomRecipes.length < 4) {
        const random = Math.floor(Math.random() * recipeNum);
        if (usedNumbers.find((ele) => ele === random)) {
          continue;
        }
        fourRandomRecipes.push(await Recipe.findOne().skip(random));
      }

      return res.status(200).send({
        recipes: fourRandomRecipes,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as mayAlsoLikeRouter };
