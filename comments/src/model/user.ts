import mongoose from "mongoose";

interface UserAttrs {
  username: string;
  id: string;
}

export interface UserDoc extends mongoose.Document {
  username: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        const id = ret._id;
        ret.id = id;
        delete ret._id;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new User({
    _id: attrs.id,
    username: attrs.username,
  });
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
