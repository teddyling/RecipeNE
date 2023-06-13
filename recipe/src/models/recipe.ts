/*

title: GuoBaoRou
description: string
ingredients: [pork, garlic,scallion,carrots sugar, vegtable oil,  white vinegar, aged vinegar, rice vinegar, salt, soy sauce, sesame oil]
steps: string[]
Categories: [pork, main dish]
recipe provider: string,
recipe video url: string


*/

import mongoose from "mongoose";
import slugify from "slugify";
import { Category } from "./recipe-category";
interface RecipeAttrs {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  popularity: number;
  category: Category[];
  recipe_provider_name: string;
  recipe_provider_url: string;
  recipe_video_url: string;
  must_know?: boolean;
}

interface RecipeDoc extends mongoose.Document {
  title: string;
  description: string;
  popularity: number;
  slug: string;
  ingredients: string[];
  steps: string[];
  category: Category[];
  recipe_provider_name: string;
  recipe_provider_url: string;
  recipe_video_url: string;
  must_know?: boolean;
}

interface RecipeModel extends mongoose.Model<RecipeDoc> {
  build(attrs: RecipeAttrs): RecipeDoc;
}

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A recipe must have a title!"],
      unique: true,
      maxlength: 50,
      minlength: 5,
      trim: true,
    },
    description: String,
    slug: {
      type: String,
      select: false,
    },
    popularity: {
      type: Number,
      required: [true, "A recipe must have a popularity"],
      max: 5,
      min: 1,
    },
    ingredients: {
      type: [String],
      required: [true, "A recipe must have ingredients!"],
    },
    steps: {
      type: [String],
      required: [true, "A recipe must have a steps specified!"],
    },
    category: {
      type: [
        {
          type: String,
          enum: [
            Category.APPETIZER,
            Category.BEEF,
            Category.CHICKEN,
            Category.DESSERT,
            Category.FISH,
            Category.LAMB,
            Category.MAIN_DISH,
            Category.NOODLE,
            Category.PORK,
            Category.RICE,
            Category.SEAFOOD,
            Category.SIDE_DISH,
            Category.SOUP,
            Category.SOY,
            Category.VEGAN_FRIENDLY,
            Category.VEGETABLE,
          ],
        },
      ],
    },
    recipe_provider_name: String,
    recipe_provider_url: String,
    recipe_video_url: String,
    must_know: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
recipeSchema.pre("save", function (next) {
  this.slug = slugify(this.title!, { lower: true });
  next();
});

recipeSchema.statics.build = (attrs: RecipeAttrs) => {
  return new Recipe(attrs);
};

const Recipe = mongoose.model<RecipeDoc, RecipeModel>("Recipe", recipeSchema);

export { Recipe, RecipeAttrs };
