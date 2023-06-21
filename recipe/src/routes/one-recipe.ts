import express, { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/recipe";
// import { ResourceNotFoundError } from "../../utilities/errors/resource-not-found-error";
import { ResourceNotFoundError } from "@dongbei/utilities";

const router = express.Router();

router.get(
  "/api/v1/recipes/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const foundRecipe = await Recipe.findById(id);

      if (!foundRecipe) {
        console.log("NOT FOUND!!");
        throw new ResourceNotFoundError();
      }

      res.send({
        data: {
          recipe: foundRecipe,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as getOneRecipeRouter };
