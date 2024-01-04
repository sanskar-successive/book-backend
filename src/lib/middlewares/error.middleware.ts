import { NextFunction, Request, Response } from "express";
import SystemResponse from "../config/responseHandler";
import { HttpError } from "http-errors";

class ErrorHandler {
  // eslint-disable-next-line
  public handleError = (err: HttpError, req: Request, res: Response, next : NextFunction): void => {
    console.log("error handler chal rha hai");
    SystemResponse.error(res, err);
  }
}
export default new ErrorHandler().handleError;
