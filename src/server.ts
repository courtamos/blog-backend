import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default function createServer() {
  const app: Application = express();
  const db = process.env.MONGO_URI || '';

  mongoose
  .connect(db, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB is now connected...'))
    .catch(err => console.log(err));
    
  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello');
  });

  return app;
}
