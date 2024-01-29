import { NextFunction, Request, Response } from "express";
import validationConfig from "../config/validationConfig";

class DynamicValidationMiddleware {
  public dynamicValidation = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {

      const path = req.url;
      console.log("path", path);
      
      const method = req.method;
      const key = `${path} ${method}`;
      console.log("key", key);
      if (Object.keys(validationConfig).includes(key)) {
        const schema = validationConfig[key];
        const toValidate = req.body;
        const { error } = schema.validate(toValidate, { abortEarly: false });
        if (error) {
          res.status(406).json(error);
          return;
        }
      }
      next();
    } catch (err) {
      res.status(404).send("error in dynamic validation middleware")
    }
  };
}
export default new DynamicValidationMiddleware().dynamicValidation;
