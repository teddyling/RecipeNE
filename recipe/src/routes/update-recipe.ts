import express, { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/recipe";
import { NotFoundError } from "../../utilities/errors/not-found-error";
// This route is admin only
const router = express.Router();

router.patch(
  "/api/v1/recipes/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const recipe = await Recipe.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!recipe) {
        throw new NotFoundError();
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
