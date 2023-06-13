import express, { Request, Response } from "express";
import { Category } from "../models/recipe-category";
import { Recipe, RecipeAttrs } from "../models/recipe";

const router = express.Router();

const recipeSeeds: RecipeAttrs[] = [
  {
    title: "GuoBaoRou",
    popularity: 5,
    description: "Harbin Dish",
    ingredients: ["pork", "carrot", "scallion", "garlic"],
    steps: ["fried pork", "make sauce", "cook all together"],
    category: [Category.PORK, Category.MAIN_DISH],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=U3JHL-F7y5Y&t=469s",
    must_know: true,
  },
  {
    title: "Potato braise eggplant",
    popularity: 5,
    description: "Common Dongbei Dish",
    ingredients: [
      "eggplant",
      "potato",
      "pork belly",
      "garlic",
      "ginger",
      "scallion",
    ],
    steps: [
      "fried eggplant",
      "cook pork belly",
      "add potato",
      "mix together",
      "braise",
    ],
    category: [Category.PORK, Category.VEGETABLE, Category.MAIN_DISH],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=hrhtZo4gyl8",
    must_know: true,
  },
  {
    title: "Green pepper and dry bean curd",
    popularity: 4.5,
    description: "Home Dongbei Dish",
    ingredients: [
      "dry bean curd",
      "green pepper",
      "pork belly",
      "ginger",
      "scallion",
    ],
    steps: [
      "boil dry bean curd",
      "cook pork belly",
      "mix together",
      "add bean curd",
    ],
    category: [Category.PORK, Category.VEGETABLE, Category.SIDE_DISH],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=m8Y2LfyJDiQ",
  },
  {
    title: "red braised lamb",
    popularity: 4,
    description: "delicious lamb dish",
    ingredients: ["Lamb leg", "cook lamb", "star anisee", "ginger", "scallion"],
    steps: [
      "marinate lamb",
      "fried lamb",
      "braise lamb",
      "redice the drice down",
    ],
    category: [Category.LAMB, Category.MAIN_DISH],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=jq8WiiG1Ik8&t=408s",
  },
  {
    title: "potato braised beef",
    popularity: 4,
    description: "delicious beef dish",
    ingredients: [
      "beef siloin",
      "potato",
      "star anisee",
      "sichuan peppercorn",
      "scallion",
      "ginger",
    ],
    steps: [
      "boil beef",
      "fry beef",
      "add ginger, scallion",
      "cook beef",
      "add potato",
      "reduce drice",
    ],
    category: [Category.BEEF, Category.MAIN_DISH],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=hPtxD5lx2Dc&t=9s",
  },
  {
    title: "red braised fish",
    popularity: 4.5,
    description: "delicious fish dish",
    ingredients: [
      "fish",
      "pork belly",
      "star anisee",
      "sichuan peppercorn",
      "scallion",
      "ginger",
      "dry chilly",
    ],
    steps: [
      "boil fish",
      "cook spice and add fish",
      "add water and boil",
      "reduce the drice down",
    ],
    category: [Category.FISH, Category.MAIN_DISH],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=SspF5BhlLac&t=430s",
  },
  {
    title: "North Eastern egg fried sause noodle",
    popularity: 4,
    description: "quick and easy noodle",
    ingredients: ["egg", "north eastern bean paste", "green pepper"],
    steps: ["fried sause", "add on noodle"],
    category: [Category.NOODLE, Category.MAIN_DISH],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=LufARlY6CAw&t=282s",
  },
  {
    title: "chicken braised mushroom",
    popularity: 5,
    description: "one of the most famous dongbei dish",
    ingredients: [
      "chicken",
      "mushroom",
      "sichuan peppercorn, scallion, ginger",
    ],
    steps: [
      "fried chicken and spicies",
      "add mushroom",
      "braise",
      "reduce drice",
    ],
    category: [Category.CHICKEN, Category.MAIN_DISH],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=22ITW8TuYLI&t=8s",
    must_know: true,
  },
  {
    title: "sesame sause noodle",
    popularity: 3.5,
    description: "quick and easy noodle",
    ingredients: [
      "cucumber",
      "radish",
      "sichuan peppercorn, start anise, bean sprout, sesame paste",
    ],
    steps: [
      "fried spicy oil",
      "cook bean sprout and noodle",
      "add everything",
      "mix",
    ],
    category: [
      Category.NOODLE,
      Category.VEGAN_FRIENDLY,
      Category.VEGETABLE,
      Category.MAIN_DISH,
    ],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=Uhzf44elze8&t=432s",
  },
  {
    title: "egg fried rice",
    popularity: 5,
    description: "famous and easy rice",
    ingredients: ["rice", "cucumber", "carrot", "scallion"],
    steps: ["cut veggies", "fried rice"],
    category: [Category.RICE, Category.MAIN_DISH],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=BoGLmT-vFos",
  },
  {
    title: "Candied Sweet potato",
    popularity: 5,
    description: "the most famous dongbei dessert",
    ingredients: ["sweet potato", "sugar"],
    steps: ["cut and fry sweet potato", "cook sugar", "mix"],
    category: [
      Category.DESSERT,
      Category.SIDE_DISH,
      Category.VEGAN_FRIENDLY,
      Category.VEGETABLE,
    ],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=udjW6A3jUjA",
    must_know: true,
  },
  {
    title: "scallion mix tofu",
    popularity: 4,
    description: "delicious and fragrent appetizer",
    ingredients: ["tofu", "scallion", "cilantro"],
    steps: ["cut scallion, tofu, and cilantro", "boil tofu", "mix together"],
    category: [
      Category.APPETIZER,
      Category.SIDE_DISH,
      Category.VEGAN_FRIENDLY,
      Category.VEGETABLE,
    ],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=QDljyhAEa00&t=11s",
  },
  {
    title: "spicy fried clams",
    popularity: 4,
    description: "spicy and fragrent seafood dish",
    ingredients: ["clams", "dry chilli", "garlic"],
    steps: ["boil clams", "fried chilli and garlic", "mix together"],
    category: [Category.SEAFOOD, Category.SIDE_DISH],
    recipe_provider_name: "Lao Dong Bei",
    recipe_provider_url: "https://www.youtube.com/@user-ep3ex5xz5r",
    recipe_video_url: "https://www.youtube.com/watch?v=c1SmAXSqkmI",
  },
];

router.post("/api/v1/recipes/seeds", async (req, res) => {
  try {
    const storedRecipes = await Recipe.find();

    if (storedRecipes.length === 0) {
      recipeSeeds.forEach((recipeSeed) => {
        const buildRecipe = Recipe.build(recipeSeed);
        buildRecipe.save();
      });

      res.status(200).send({
        message: "success",
      });
    } else {
      res.send({ message: "DB has already seeded!" });
    }
  } catch (err) {
    console.error(err);
  }
});

export { router as seedRouter };
