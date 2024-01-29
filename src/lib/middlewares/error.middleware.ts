import { NextFunction, Request, Response } from "express";

class ErrorHandler {
  // eslint-disable-next-line
  public handleError = (err: unknown, req: Request, res: Response, next : NextFunction): void => {
    res.send(err)
  }
}
export default new ErrorHandler().handleError;

