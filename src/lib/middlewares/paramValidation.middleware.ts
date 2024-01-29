import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
class ParamValidationMiddleware {
  public paramValidation = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const {bookId} = req.params;

      if(isValidObjectId(bookId)){
        next();
      }
      else{
        res.status(406).send("not valid book id");
      }
    } catch (error) {
      res.status(404).send(error);
    }
  };
}

export default new ParamValidationMiddleware().paramValidation;
