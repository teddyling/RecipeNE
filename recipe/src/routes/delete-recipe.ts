import express, { NextFunction, Request, Response } from "express";
import { Recipe } from "../models/recipe";
// import { ResourceNotFoundError } from "../../utilities/errors/resource-not-found-error";
import {
  ResourceNotFoundError,
  addAuthHeader,
  ensureAdmin,
  ensureLogin,
  doubleCsrfUtilities,
} from "@dongbei/utilities";

// This route is admin only route
const router = express.Router();
const { doubleCsrfProtection } = doubleCsrfUtilities;

router.delete(
  "/api/v1/recipes/:id",

  addAuthHeader,
  ensureLogin,
  ensureAdmin,
  doubleCsrfProtection,

  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const recipe = await Recipe.findByIdAndDelete(id);
      if (!recipe) {
        throw new ResourceNotFoundError();
      }
      res.status(204).send({
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as deleteRecipeRouter };
