import express, { Request, Response } from "express";

import { getAllRecipeRouter } from "./routes/all-recipe";
import { getOneRecipeRouter } from "./routes/one-recipe";
import { createNewRecipeRouter } from "./routes/new-recipe";
import { updateRecipeRouter } from "./routes/update-recipe";
import { deleteRecipeRouter } from "./routes/delete-recipe";
import { errorHandler } from "../utilities/middlewares/error-handler";
import { NotFoundError } from "../utilities/errors/not-found-error";
import { seedRouter } from "./routes/seed-recipe";

const app = express();
app.use(express.json());

app.use(seedRouter);
app.use(getAllRecipeRouter);
app.use(getOneRecipeRouter);
app.use(createNewRecipeRouter);
app.use(updateRecipeRouter);
app.use(deleteRecipeRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
