import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import express, { Request, Response, NextFunction } from "express";
import { User } from "../model/user";

import { BadRequestError } from "@dongbei/utilities";
import {
  RequestValidationError,
  ServerInternalError,
} from "@dongbei/utilities";
import { sendEmail } from "@dongbei/utilities";

const router = express.Router();

router.post(
  "/api/v1/users/signup",
  [
    body("email")
      .exists()
      .notEmpty()
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("username")
      .exists()
      .notEmpty()
      .isLength({ max: 15, min: 4 })
      .withMessage("Username must be between 4-20 characters")
      .isAlphanumeric()
      .withMessage("Username contains invalid characters")
      .trim(),

    body("password")
      .exists()
      .notEmpty()
      .trim()
      .isLength({ max: 20, min: 8 })
      .withMessage("Password must be between 8-20 characters")
      .custom((value: string) => {
        const upper = /[A-Z]/.test(value);
        const lower = /[a-z]/.test(value);
        const number = /[0-9]/.test(value);
        return upper && lower && number;
      })
      .withMessage(
        "Password must contain uppercase letters, lowercase letters, and numbers"
      ),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }
      const { username, password, email } = req.body;
      const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail) {
        throw new BadRequestError("The email is already in use!");
      }
      const existingUserUsername = await User.findOne({ username });
      if (existingUserUsername) {
        throw new BadRequestError("The username is already in use!");
      }

      const newUser = User.build({
        username,
        password,
        email,
      });

      const verifyToken = newUser.createEmailVerifyToken();

      await newUser.save();

      const verifyURL = `${req.protocol}://www.recipe-ne.com/api/v1/users/verifysignup/${verifyToken}`;
      const emailSubject = `Please Verify Your Email Address for RecipeNE`;
      const content = ``;

      const html = `<!DOCTYPE html>
      <html>
      <head>
      
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Email Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
        /**
         * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
         */
        @media screen {
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 400;
            src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
          }
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 700;
            src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
          }
        }
        /**
         * Avoid browser level font resizing.
         * 1. Windows Mobile
         * 2. iOS / OSX
         */
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%; /* 1 */
          -webkit-text-size-adjust: 100%; /* 2 */
        }
        /**
         * Remove extra space added to tables and cells in Outlook.
         */
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
        /**
         * Better fluid images in Internet Explorer.
         */
        img {
          -ms-interpolation-mode: bicubic;
        }
        /**
         * Remove blue links for iOS devices.
         */
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
        /**
         * Fix centering issues in Android 4.4.
         */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        /**
         * Collapse table borders to avoid space between cells.
         */
        table {
          border-collapse: collapse !important;
        }
        a {
          color: #1a82e2;
        }
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
        </style>
      
      </head>
      <body style="background-color: #fff1dd;">
      
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        Verify your signup email
        </div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" bgcolor="#fff1dd">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center" valign="top" style="padding: 36px 24px;">
                    <a href="https://www.recipe-ne.com" target="_blank" style="display: inline-block;">
                      <img src="https://www.recipe-ne.com/logo.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#fff1dd">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #ffd496;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Greetings!</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#fff1dd">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">Thanks for registering for an account on RecipeNE. We are super glad to have you! Before we get started, we just need to confirm that this is you. Click the button below to verify your email address:</p>
                  </td>
                </tr>
                <tr>
                  <td align="left" bgcolor="#ffffff">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                <a href="${verifyURL}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: #fb923c">Verify your Email</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">If that doesn't work, click this <a href="${verifyURL}">Link</a> to verify your email</p>
              
                  </td>
                </tr>
      
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #ffd496">
                    <p style="margin: 0;">Welcome aboard,<br> RecipeNE</p>
                  </td>
                </tr>
      
      
              </table>
      
            </td>
          </tr>
      
          <tr>
            <td align="center" bgcolor="#fff1dd" style="padding: 24px;">
      
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
      
                <tr>
                  <td align="center" bgcolor="#fff1dd" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                    <p style="margin: 0;">This email was sent from RecipeNE.com</p>
                  </td>
                </tr>
      
      
              </table>
      
            </td>
          </tr>
      
      
        </table>
      
      
      </body>
      </html>`;

      try {
        await sendEmail(newUser.email, emailSubject, content, html);
      } catch (error) {
        console.log(error);
        newUser.emailVerifyToken = undefined;
        newUser.emailVerifyTokenExpires = undefined;
        await newUser.save();
        return next(new ServerInternalError("Failed sending email."));
      }

      res.status(200).send({
        data: {
          user: newUser,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

export { router as signupRouter };
