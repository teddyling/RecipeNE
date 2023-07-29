import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
// import { DatabaseConnectionError } from "../utilities/errors/database-connection-error";
import { DatabaseConnectionError, client } from "@dongbei/utilities";
import { seeds } from "./recipeSeeds";
import { Recipe } from "./models/recipe";
import { RecipeCreatedPublisher } from "./events/recipe-created-publisher";

const start = async () => {
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exeception, shuting down...", err);
    process.exit(1);
  });
  console.log("starting....");

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined!");
  }

  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined!");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined!");
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined!");
  }

  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not defined!");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit(0);
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB successfully!");
    if ((await Recipe.countDocuments()) === 0) {
      for (let seed of seeds) {
        const recipe = Recipe.build(seed);
        const savedRecipe = await recipe.save();
        await new RecipeCreatedPublisher(natsWrapper.client).publish({
          id: savedRecipe.id,
          title: savedRecipe.title,
        });
      }
      console.log("DB Seeded successfully");
    }

    await client.connect();
    console.log("Connected to Redis successfully");
  } catch (err) {
    console.error(err);
    throw new DatabaseConnectionError();
  }

  const server = app.listen(3000, () => {
    console.log("Start listening on port 3000!");
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection, shuting down...", err);
    server.close(() => process.exit(1));
  });
};

start();
