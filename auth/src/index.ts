import mongoose from "mongoose";
import { app } from "./app";
//import { DatabaseConnectionError } from "../utilities/errors/database-connection-error";
import { DatabaseConnectionError } from "@dongbei/utilities";

const start = async () => {
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exeception, shuting down...", err);
    process.exit(1);
  });
  console.log("starting...");

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined!");
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB successfully!");
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
