import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Recipe } from "../models/recipe";
import { NotFoundError } from "../../utilities/errors/not-found-error";

const router = express.Router();

router.get(
  "/api/v1/recipes/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const foundRecipe = await Recipe.findById(id);

      if (!foundRecipe) {
        console.log("NOT FOUND!!");
        throw new NotFoundError();
      }

      res.send({
        status: "success",
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
