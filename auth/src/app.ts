import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
const { xss } = require("express-xss-sanitizer");
// import { xss } from "express-xss-sanitizer";
import hpp from "hpp";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";

import { doubleCsrfUtilities } from "@dongbei/utilities";

import { errorHandler } from "@dongbei/utilities";
import { NotFoundError } from "@dongbei/utilities";
import { signupRouter } from "./routes/signup";
import { loginRouter } from "./routes/login";
// import { verifyJwtRouter } from "./routes/verifyJwt";
import { forgetPasswordRouter } from "./routes/forget-password";
import { resetPasswordRouter } from "./routes/reset-password";
import { updatePasswordRouter } from "./routes/update-password";
import { verifyEmailRouter } from "./routes/verify-signup-email";
import { updateMyUsernameRouter } from "./routes/update-my-username";
import { updateMyEmailRouter } from "./routes/update-my-email";
import { verifyEmailChangeRouter } from "./routes/verify-email-change";
import { signoutRouter } from "./routes/signout";
import { currentUserRouter } from "./routes/current-user";
import { refreshTokenRouter } from "./routes/refresh-token";
import { getAllUsersRouter } from "./routes/all-user";
import { resendemailRouter } from "./routes/resend-email";

const app = express();
app.disable("x-powered-by");

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "To many requests",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

app.use(helmet());
// app.use("/api/v1/users", limiter);

app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(
  cookieSession({
    httpOnly: true,
    signed: false,

    secret: process.env.SESSION_SECRET,
    sameSite: "lax",
  })
);

app.use(cookieParser(process.env.SESSION_SECRET));

app.use(signupRouter);
app.use(loginRouter);
// app.use(verifyJwtRouter);
app.use(forgetPasswordRouter);
app.use(resetPasswordRouter);
app.use(updatePasswordRouter);
app.use(verifyEmailRouter);
app.use(resendemailRouter);
app.use(updateMyUsernameRouter);
app.use(updateMyEmailRouter);
app.use(verifyEmailChangeRouter);
app.use(signoutRouter);
app.use(currentUserRouter);
app.use(refreshTokenRouter);
app.use(getAllUsersRouter);
// Refresh Token Route has to be implemented

app.all("*", (req: Request, res: Response) => {
  throw new NotFoundError(req.originalUrl);
});

app.use(errorHandler);

export { app };
