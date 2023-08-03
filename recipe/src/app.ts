import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
const { xss } = require("express-xss-sanitizer");

import hpp from "hpp";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import { getAllRecipeRouter } from "./routes/all-recipe";
// import { seedRouter } from "./routes/seed-recipe";
import { mustKnowRouter } from "./routes/must-know";
import { getOneRecipeRouter } from "./routes/one-recipe";
import { createNewRecipeRouter } from "./routes/new-recipe";
import { updateRecipeRouter } from "./routes/update-recipe";
import { deleteRecipeRouter } from "./routes/delete-recipe";
import { getOneRecipeBySlugRouter } from "./routes/one-recipe-by-slug";
// import { errorHandler } from "../utilities/middlewares/error-handler";
// import { NotFoundError } from "../utilities/errors/not-found-error";
import { errorHandler } from "@dongbei/utilities";
import { NotFoundError } from "@dongbei/utilities";
import { mayAlsoLikeRouter } from "./routes/get-random-recipes";

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "To many requests",
//   standardHeaders: true,
//   legacyHeaders: false,
// });
app.use(helmet());
// app.use("/api/v1/recipes", limiter);
app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ["title", "popularity", "category"],
  })
);

app.use(
  cookieSession({
    httpOnly: true,
    signed: false,
    secure: true,

    secret: process.env.SESSION_SECRET,
    sameSite: "lax",
  })
);

app.use(cookieParser(process.env.SESSION_SECRET));

// app.use(seedRouter);
app.use(getAllRecipeRouter);
app.use(mustKnowRouter);
app.use(mayAlsoLikeRouter);
app.use(getOneRecipeRouter);
app.use(createNewRecipeRouter);
app.use(updateRecipeRouter);
app.use(deleteRecipeRouter);
app.use(getOneRecipeBySlugRouter);

app.all("*", (req: Request, res: Response) => {
  throw new NotFoundError(req.originalUrl);
});

app.use(errorHandler);

export { app };
