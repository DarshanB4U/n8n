declare global {
  namespace Express {
    interface Request {
      userID: string;
    }
  }
}

extend;

export {};
