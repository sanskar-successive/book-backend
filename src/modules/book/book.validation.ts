import Joi from "joi";

// export const authorSchema = Joi.object({
//   name: Joi.string().required(),
//   about: Joi.string().required(),
//   // rating: Joi.number(),
// });

// // export const reviewSchema = Joi.object({
// //   user: Joi.string().required(),
// //   book: Joi.string().required(),
// //   rating: Joi.number().required(),
// //   text: Joi.string().required(),
// //   image: Joi.string(),
// //   helpful: Joi.boolean(),
// // });

// export const moreDetailsSchema = Joi.object({
//   publishDetails: Joi.object({
//     name: Joi.string().required(),
//     lastPublished: Joi.date().required(),
//   }).required(),
//   seller: Joi.string().required(),
//   language: Joi.string().valid('English', 'Hindi').required(),
//   description: Joi.string().required(),
//   fileSize: Joi.number().required(),
//   length: Joi.number().required(),
// });

// export const bookSchema = Joi.object({
//   title: Joi.string().required(),
//   coverImage: Joi.string(),
//   category: Joi.string().valid('Category1', 'Category2', 'Category3').required(),
//   author: authorSchema.required(),
//   globalRating: Joi.number().required(),
//   // reviews: Joi.array().items(reviewSchema),
//   price: Joi.number().required(),
//   moreDetails: moreDetailsSchema.required(),
//   tags: Joi.array().items(Joi.string()),
//   rank: Joi.number(),
//   categoryRank: Joi.number(),
// });





export const moreDetailsSchema = Joi.object({
  publisher: Joi.string().required(),
  firstPublished: Joi.date(),
  seller: Joi.string().required(),
  language: Joi.string().valid('english', 'hindi', 'sanskrit', 'telugu', 'bengali', 'tamil').required(),
  description: Joi.string().required(),
  fileSize: Joi.number().required(),
  pages: Joi.number().required(),
  verified: Joi.boolean(),
  edition: Joi.number(),
});

// Author Schema
export const authorSchema = Joi.object({
  name: Joi.string().required(),
  about: Joi.string().required(),
});

// Book Schema
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
