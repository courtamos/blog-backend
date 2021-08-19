import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app: Application = express();

const db = process.env.MONGO_URI || '';
const port = process.env.PORT || 5000;

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});