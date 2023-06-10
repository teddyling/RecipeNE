import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("starting...");

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined!");
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Start listening on port 3000!");
  });
};

start();
