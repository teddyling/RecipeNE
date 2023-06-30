import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
// import { createClient } from "redis";
import { client } from "@dongbei/utilities";
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import jwt from "jsonwebtoken";
import {
  BadRequestError,
  NotAuthorizedError,
  doubleCsrfUtilities,
  RequestValidationError,
  TooManyRequestError,
} from "@dongbei/utilities";
import { User } from "../model/user";
import { Password } from "../service/Password";
import e from "express";

// const protectLoginRedisClient = createClient({
//   legacyMode: true,
//   disableOfflineQueue: true,
// });

const maxWrongAttemptsByIPperDay = 50;
const maxConsecutiveFailsByUsernameAndIP = 6;

const limiterSlowBruteByIP = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: "login_fail_ip_per_day",
  points: maxWrongAttemptsByIPperDay,
  duration: 24 * 60 * 60,
  blockDuration: 60 * 60 * 24 * 3,
});

const limiterConsecutiveFailsByUsernameAndIp = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: "login_fail_consecutive_username_and_ip",
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90,
  blockDuration: 60 * 60,
});

const getEmailIpKey = (email: string, ip: string) => `${email}+${ip}`;

const router = express.Router();

router.post(
  "/api/v1/users/login",
  [
    body("email")
      .exists()
      .notEmpty()
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .exists()
      .notEmpty()
      .withMessage("A password must be supplied"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      const { email, password } = req.body;

      const userIp = req.ip;
      const userEmailandIpKey = getEmailIpKey(email, userIp);
      const [resUsernameAndIp, resSlowByIp] = await Promise.all([
        limiterConsecutiveFailsByUsernameAndIp.get(userEmailandIpKey),
        limiterSlowBruteByIP.get(userIp),
      ]);

      let retrySecs = 0;

      if (
        resSlowByIp !== null &&
        resSlowByIp.consumedPoints > maxWrongAttemptsByIPperDay
      ) {
        retrySecs = Math.round(resSlowByIp.msBeforeNext / 1000) || 1;
      } else if (
        resUsernameAndIp !== null &&
        resUsernameAndIp.consumedPoints > maxConsecutiveFailsByUsernameAndIP
      ) {
        retrySecs = Math.round(resUsernameAndIp.msBeforeNext / 1000) || 1;
      }

      if (retrySecs > 0) {
        throw new TooManyRequestError("Too many request", String(retrySecs));
      }

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        try {
          const saveUserIpInRedis = await limiterSlowBruteByIP.consume(userIp);
          throw new NotAuthorizedError("Invalid Credentials");
        } catch (rlRejected) {
          if (rlRejected instanceof Error) {
            throw rlRejected;
          } else if (rlRejected instanceof RateLimiterRes) {
            throw new TooManyRequestError(
              "Too many requests",
              String(Math.round(rlRejected.msBeforeNext / 1000))
            );
          } else {
            throw new Error("Something went wrong!");
          }
        }
      }
      const correctPassword = await Password.compare(
        existingUser.password,
        password
      );
      if (!correctPassword) {
        try {
          const promises = [
            limiterSlowBruteByIP.consume(userIp),
            limiterConsecutiveFailsByUsernameAndIp.consume(userEmailandIpKey),
          ];
          await Promise.all(promises);
          throw new NotAuthorizedError("Invalid Credentials");
        } catch (rlRejected) {
          if (rlRejected instanceof Error) {
            throw rlRejected;
          } else if (rlRejected instanceof RateLimiterRes) {
            throw new TooManyRequestError(
              "Too many requests",
              String(Math.round(rlRejected.msBeforeNext / 1000))
            );
          } else {
            throw new Error("Something went wrong!");
          }
        }
      }

      const refreshToken = existingUser.createRefreshToken(existingUser.id);
      await existingUser.save();

      const token = jwt.sign(
        {
          id: existingUser.id,
          role: existingUser.role,
          email: existingUser.email,
          username: existingUser.username,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "10m",
        }
      );

      //console.log(req.session?.jwt);

      req.session = {
        jwt: token,
      };

      res.cookie("resetToken", refreshToken, {
        httpOnly: true,
        signed: true,
        path: "/api/v1",
        secure: false,
        sameSite: "lax",
      });

      const { generateToken } = doubleCsrfUtilities;
      const csrfToken = generateToken(res, req);

      res.status(200).send({
        data: existingUser,
        token: token,
        csrfToken,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as loginRouter };
