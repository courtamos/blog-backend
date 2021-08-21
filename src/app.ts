import express, { Application, Request, Response, NextFunction } from "express";
import { createServer } from "./server";

const startServer = async () => {
  const app = await createServer();
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
