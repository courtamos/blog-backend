import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./routes";

dotenv.config();

export default function createServer() {
  const app: Application = express();
  app.use(express.json());
  const db = process.env.MONGO_URI || '';

  mongoose
  .connect(db, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB is now connected...'))
    .catch(err => console.log(err));

  app.use(routes);
    
  app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello');
  });

  return app;
}
