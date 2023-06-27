import mongoose from "mongoose";
import { RecipeDoc } from "./recipe";
import { UserDoc } from "./user";

interface CommentAttrs {
  content: string;
  recipe: RecipeDoc;
  user: UserDoc;
}

interface CommentDoc extends mongoose.Document {
  user: UserDoc;
  content: string;
  recipe: RecipeDoc;
}

interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

commentSchema.statics.build = (attrs: CommentAttrs): CommentDoc => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  commentSchema
);
export { Comment };
