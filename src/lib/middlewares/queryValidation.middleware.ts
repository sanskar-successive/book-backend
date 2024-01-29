import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const querySchema = Joi.object({
  "search": Joi.string().trim(),
  "price.from": Joi.string().custom((value, helper) => {
    if (isNaN(value)) {
      return helper.message({ custom: 'price should be a numeric value' });
    }
    return value;
  }),
  "price.to": Joi.string().custom((value, helper) => {
    if (isNaN(value)) {
      return helper.message({ custom: 'price should be a numeric value' });
    }
    return value;
  }),
  "rating": Joi.string(),
  "category": Joi.alternatives(
    Joi.string().valid(
      'fiction', 'mystery', 'arts', 'science', 'romance', 'horror', 'religion',
      'philosophy', 'history', 'poetry', 'biography', 'technology'
    ),
    Joi.array().items(Joi.string().valid(
      'fiction', 'mystery', 'arts', 'science', 'romance', 'horror', 'religion',
      'philosophy', 'history', 'poetry', 'biography', 'technology'
    ))
  ),
  "language": Joi.alternatives(
    Joi.string().valid('english', 'hindi', 'sanskrit', 'telugu', 'bengali', 'tamil'),
    Joi.array().items(Joi.string().valid('english', 'hindi', 'sanskrit', 'telugu', 'bengali', 'tamil'))
  ),
  "sortBy" : Joi.string(),
  "skip": Joi.string().custom((value, helper) => {
    if (isNaN(value)) {
      return helper.message({ custom: 'skip should be a numeric value' });
    }
    return value;
  }),
  "limit": Joi.string().custom((value, helper) => {
    if (isNaN(value)) {
      return helper.message({ custom: 'limit should be a numeric value' });
    }
    return value;
  }),
});

class QueryValidationMiddleware {
  public queryValidation = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const query = req.query;
      const { error } = querySchema.validate(query, { abortEarly: false });
      if (error) {
        res.status(406).send(error);
        return;
      }
      next();
    } catch (err) {
      res.status(404).send(err)
    }
  };
}
export default new QueryValidationMiddleware().queryValidation;
