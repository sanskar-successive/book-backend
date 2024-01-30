import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
class ParamValidationMiddleware {
  public paramValidation = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { bookId } = req.params;

      console.log("update book id", bookId);
      

      // 6 5 a 4 0 6 7 8 2 3 9 5 e 4 6 9 b e 9 1 9 b c f 

      if (!isValidObjectId(bookId)) {
        return res.status(406).send("not valid book id");
      }
      next();

    } catch (error) {
      res.status(404).send(error);
    }
  };
}
export default new ParamValidationMiddleware().paramValidation;
