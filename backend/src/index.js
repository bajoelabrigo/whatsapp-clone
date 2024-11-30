import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./config/logger.config.js";
import { Server } from "socket.io";

//dotEnv config
dotenv.config();

//env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

//exit on mongo error
mongoose.connection.on("error", (err) => {
  logger.error(err);
  process.exit(1);
});

//mongo debug mode
if (process.env.NODE_ENV === "production") {
  mongoose.set("debug", true);
}

//connect to db
mongoose
  .connect(DATABASE_URL, {})
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((err) => {
    logger.error(err);
  });

let server;

server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});


//socket io





//handle server errors
const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});
