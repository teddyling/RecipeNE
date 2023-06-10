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
import { Category } from "./recipe-category";
interface RecipeAttrs {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  category: Category[];
  recipe_provider_name: string;
  recipe_provider_url: string;
  recipe_video_url: string;
}

interface RecipeDoc extends mongoose.Document {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  category: Category[];
  recipe_provider_name: string;
  recipe_provider_url: string;
  recipe_video_url: string;
}

interface RecipeModel extends mongoose.Model<RecipeDoc> {
  build(attrs: RecipeAttrs): RecipeDoc;
}

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A recipe must have a title!"],
      unique: [true, "All recipes must have a unique name!"],
    },
    description: String,
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

recipeSchema.statics.build = (attrs: RecipeAttrs) => {
  return new Recipe(attrs);
};

const Recipe = mongoose.model<RecipeDoc, RecipeModel>("Recipe", recipeSchema);

export { Recipe };
