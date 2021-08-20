import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes";

dotenv.config();

export const createServer = async () => {
  const app: Application = express();
  app.use(express.json());
  const db = process.env.MONGO_URI || '';

  try {
    await mongoose.connect(db, 
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      })
      console.log('MongoDB is now connected...');
  } catch (err) {
    console.log(err);
  }

  app.use(routes);
  
  return app;
}
