import express, { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/recipe";
//import { ResourceNotFoundError } from "../../utilities/errors/resource-not-found-error";
import {
  ResourceNotFoundError,
  addAuthHeader,
  ensureAdmin,
  ensureLogin,
  doubleCsrfUtilities,
} from "@dongbei/utilities";

// This route is admin only
const router = express.Router();
const { doubleCsrfProtection } = doubleCsrfUtilities;

router.patch(
  "/api/v1/recipes/:id",

  ensureLogin,
  ensureAdmin,
  //doubleCsrfProtection,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const recipe = await Recipe.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!recipe) {
        throw new ResourceNotFoundError();
      }

      res.send({
        status: "success",
        data: {
          recipe,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as updateRecipeRouter };
