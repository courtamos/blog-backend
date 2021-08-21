declare namespace Express {
  interface Request {
    user: {
      id: string;
      iat: number;
    };
  }
}
