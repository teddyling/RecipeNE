import mongoose from "mongoose";
import { Password } from "../service/Password";

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
  passwordChangedAt?: Date;
  changedPasswordAfterJwt: (timestamp: number) => boolean;
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
    passwordChangedAt: {
      type: Date,
    },
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

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
