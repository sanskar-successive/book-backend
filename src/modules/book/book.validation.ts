import Joi from "joi";

export const moreDetailsSchema = Joi.object({
  publisher: Joi.string().required(),
  firstPublished: Joi.date(),
  seller: Joi.string().required(),
  text_language: Joi.string().valid('english', 'hindi', 'sanskrit', 'telugu', 'bengali', 'tamil').required(),
  description: Joi.string().required(),
  fileSize: Joi.number().required(),
  pages: Joi.number().required(),
  verified: Joi.boolean(),
  edition: Joi.number(),
});


export const authorSchema = Joi.object({
  name: Joi.string().required(),
  about: Joi.string().required(),
});

export const bookSchema = Joi.object({
  title: Joi.string().required(),
  coverImage: Joi.string(),
  category: Joi.string().valid(
    'fiction', 'mystery', 'arts', 'science', 'romance', 'horror', 'religion',
    'philosophy', 'history', 'poetry', 'biography', 'technology'
  ).required(),
  author: authorSchema.required(),
  rating: Joi.number().required(),
  price: Joi.number().required(),
  moreDetails: moreDetailsSchema.required(),
});

