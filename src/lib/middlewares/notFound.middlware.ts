import { NextFunction, Request, Response } from "express";
class NotFound {
  public pageNotFound = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    res.status(404).send("page not found")
  };
}

export default new NotFound().pageNotFound;

