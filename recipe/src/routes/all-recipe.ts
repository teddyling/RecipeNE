import express, { NextFunction, Request, Response } from "express";
import { Recipe } from "../models/recipe";
// import { BadRequestError } from "../../utilities/errors/bad-request-error";
// import { NotFoundError } from "../../utilities/errors/not-found-error";
import { applyAPIFeature } from "../utilities/functions/apply-api-features";
import { rateLimitMiddleware } from "@dongbei/utilities";

const router = express.Router();

router.get(
  "/api/v1/recipes",
  rateLimitMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // // Regular filter
      // const queryObj = { ...req.query };
      // const excludedFields = ["page", "sort", "limit", "fields"];
      // excludedFields.forEach((ele) => delete queryObj[ele]);

      // // Advance filter, add greater than (equal) and less than (equal)
      // let queryStr = JSON.stringify(queryObj);
      // queryStr = queryStr.replace(
      //   /\b(gte|gt|lte|lt)\b/g,
      //   (match) => `$${match}`
      // );

      // let query = Recipe.find(JSON.parse(queryStr));

      // // Sorting
      // if (req.query.sort) {
      //   query = query.sort(req.query.sort as string);
      // }

      // // Field Limiting
      // if (req.query.fields) {
      //   const fields = (req.query.fields as string).split(",").join(" ");
      //   query = query.select(fields);
      // }

      // // Pagination
      // let page = 1;
      // if (req.query.page) {
      //   page = +req.query.page;
      // }
      // let limit = 1000;
      // if (req.query.limit) {
      //   limit = +req.query.limit;
      // }
      // const skip = (page - 1) * limit;

      // if (skip >= (await Recipe.countDocuments())) {
      //   throw new NotFoundError();
      // }
      // query = query.skip(skip).limit(limit);
      const query = applyAPIFeature(req);

      const recipes = await query;

      res.status(200).send({
        data: {
          recipes: recipes,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as getAllRecipeRouter };
