import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
const { xss } = require("express-xss-sanitizer");
// import { xss } from "express-xss-sanitizer";
import hpp from "hpp";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";

import { newCommentRouter } from "./routes/new-comment";
import { allMyCommentRouter } from "./routes/all-my-comment";
import { allCommentRouter } from "./routes/all-comment";
import { getCommentsByRecipeRouter } from "./routes/get-recipe-comment";

import { errorHandler } from "@dongbei/utilities";
import { NotFoundError } from "@dongbei/utilities";

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");

app.use(helmet());

app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

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

app.use(newCommentRouter);
app.use(allCommentRouter);
app.use(allMyCommentRouter);
app.use(getCommentsByRecipeRouter);

app.all("*", (req: Request, res: Response) => {
  throw new NotFoundError(req.originalUrl);
});

app.use(errorHandler);

export { app };
