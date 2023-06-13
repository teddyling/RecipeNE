import { Request } from "express";
import { Recipe } from "../../src/models/recipe";
import { NotFoundError } from "../errors/not-found-error";
const applyAPIFeature = async (req: Request) => {
  const queryObj = { ...req.query };
  // Regular filter
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((ele) => delete queryObj[ele]);

  // Advance filter, add greater than (equal) and less than (equal)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Recipe.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    query = query.sort(req.query.sort as string);
  }

  // Field Limiting
  if (req.query.fields) {
    const fields = (req.query.fields as string).split(",").join(" ");
    query = query.select(fields);
  }

  // Pagination
  let page = 1;
  if (req.query.page) {
    page = +req.query.page;
  }
  let limit = 1000;
  if (req.query.limit) {
    limit = +req.query.limit;
  }
  const skip = (page - 1) * limit;

  if (skip >= (await Recipe.countDocuments())) {
    throw new NotFoundError(req.originalUrl);
  }
  query = query.skip(skip).limit(limit);
  return query;
};

export { applyAPIFeature };
