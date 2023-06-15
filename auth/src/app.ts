import express, { Request, Response } from "express";

import { errorHandler } from "../utilities/middlewares/error-handler";
import { NotFoundError } from "../utilities/errors/not-found-error";
import { signupRouter } from "./routes/signup";
import { loginRouter } from "./routes/login";

const app = express();
app.use(express.json());

app.use(signupRouter);
app.use(loginRouter);

app.all("*", (req: Request, res: Response) => {
  throw new NotFoundError(req.originalUrl);
});

app.use(errorHandler);

export { app };
