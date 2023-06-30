import express, { NextFunction, Request, Response } from "express";
import { applyAPIFeature } from "../utilities/functions/apply-api-features";
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
      res.status(200).send({
        recipes,
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as mustKnowRouter };
