import express, { Request, Response } from "express";

import { getAllRecipeRouter } from "./routes/all-recipe";
import { seedRouter } from "./routes/seed-recipe";
import { mustKnowRouter } from "./routes/must-know";
import { getOneRecipeRouter } from "./routes/one-recipe";
import { createNewRecipeRouter } from "./routes/new-recipe";
import { updateRecipeRouter } from "./routes/update-recipe";
import { deleteRecipeRouter } from "./routes/delete-recipe";
import { errorHandler } from "../utilities/middlewares/error-handler";
import { NotFoundError } from "../utilities/errors/not-found-error";

const app = express();
app.use(express.json());

app.use(seedRouter);
app.use(getAllRecipeRouter);
app.use(mustKnowRouter);
app.use(getOneRecipeRouter);
app.use(createNewRecipeRouter);
app.use(updateRecipeRouter);
app.use(deleteRecipeRouter);

app.all("*", (req: Request, res: Response) => {
  throw new NotFoundError(req.originalUrl);
});

app.use(errorHandler);

export { app };
