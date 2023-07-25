import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { Password } from "../service/Password";
import { RefreshToken } from "../service/RefreshToken";

enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

interface UserAttrs {
  username: string;
  email: string;
  password: string;
  role?: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: string;
  verify: boolean;
  emailVerifyToken?: string;
  emailVerifyTokenExpires?: Date;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  changedEmail?: string;
  changedEmailToken?: string;
  changedEmailExpires?: Date;
  active: boolean;
  refreshToken?: string;
  changedPasswordAfterJwt: (timestamp: number) => boolean;
  createResetPasswordToken: () => string;
  createEmailVerifyToken: () => string;
  createChangeEmailToken: () => string;
  createRefreshToken: (userid: string) => Promise<string>;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [UserRole.USER, UserRole.ADMIN],
      default: UserRole.USER,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: String,
    emailVerifyTokenExpires: Date,
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    changedEmail: String,
    changedEmailToken: String,
    changedEmailExpires: Date,

    refreshToken: String,
  },
  {
    toJSON: {
      transform(doc, ret) {
        const id = ret._id;
        ret.id = id;
        delete ret.password;
        delete ret.__v;
        delete ret._id;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.methods.changedPasswordAfterJwt = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createEmailVerifyToken = function () {
  const verifyToken = crypto.randomBytes(128).toString("hex");

  this.emailVerifyToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  this.emailVerifyTokenExpires = Date.now() + 30 * 60 * 1000;
  return verifyToken;
};

userSchema.methods.createChangeEmailToken = function () {
  const changeToken = crypto.randomBytes(128).toString("hex");

  this.changedEmailToken = crypto
    .createHash("sha256")
    .update(changeToken)
    .digest("hex");
  this.changedEmailExpires = Date.now() + 10 * 60 * 1000;

  return changeToken;
};

userSchema.methods.createRefreshToken = async function (userid: string) {
  const refreshToken = jwt.sign(
    { id: userid },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "14d",
    }
  );
  const hashedRefreshToken = await RefreshToken.toHash(refreshToken);
  this.refreshToken = hashedRefreshToken;
  return refreshToken;
};

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.pre("save", function (done) {
  if (!this.isModified("password") || this.isNew) {
    return done();
  }
  this.passwordChangedAt = new Date(Date.now() - 1000);
  done();
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
