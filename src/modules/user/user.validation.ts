import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  contact: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string(),
  }),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});


