import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import routes from "./routes/index.js";


//dotEnv config
dotenv.config();

//create express app
const app = express();

//Morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//Helmet
app.use(helmet()); //segurity

//parse json
app.use(express.json());

//parse urlencoded
app.use(express.urlencoded({ extended: true }));

//sanitize request data
app.use(mongoSanitize());

//Enable cookie parser
app.use(cookieParser());

//compression
app.use(compression());

//file upload
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//cors
app.use(cors());

//api v1 routes
app.use("/api/v1", routes);

app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This route does not exist"));
});

//error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    success: false,
    status: err.status || 500,
    message: err.message,
  });
});

export default app;
