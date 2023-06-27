import mongoose from "mongoose";

interface RecipeAttrs {
  title: string;
  id: string;
}

export interface RecipeDoc extends mongoose.Document {
  title: string;
}

interface RecipeModel extends mongoose.Model<RecipeDoc> {
  build(attrs: RecipeAttrs): RecipeDoc;
}

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A recipe must have a title!"],
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

recipeSchema.statics.build = (attrs: RecipeAttrs) => {
  return new Recipe({
    _id: attrs.id,
    title: attrs.title,
  });
};

const Recipe = mongoose.model<RecipeDoc, RecipeModel>("Recipe", recipeSchema);

export { Recipe };
