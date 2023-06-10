import express, { NextFunction, Request, Response } from "express";
import { Recipe } from "../models/recipe";
// This route is admin only route
const router = express.Router();

router.delete(
  "/api/v1/recipes/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await Recipe.findByIdAndDelete(id);

      res.status(204).send({
        status: "success",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as deleteRecipeRouter };
