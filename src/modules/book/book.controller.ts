import { Request, Response } from "express";
import BookService from "./book.service";
import { IBook } from "./entities/IBook";
import Papa from "papaparse";
import fs from "fs";
import Book from "./repositories/models/book.model";
import mongoose from "mongoose";
import { bookSchema } from "./book.validation";
import BulkUpload from "./repositories/models/bulkUpload.model";
import IBulkUpload from "./entities/IBulkUpload";
import IBulkError from "./entities/IBulkError";
import BulkErrorDetail from "./repositories/models/bulkError.model";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';
import UserService from "../user/user.service";
import ILogin from "../user/entities/ILogin";
import { IUser } from "../user/entities/IUser";

class BookController {
  private bookService: BookService;
  private userService: UserService;

  constructor() {
    this.bookService = new BookService();
    this.userService = new UserService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const books: IBook[] | null = await this.bookService.getAll();
      res
        .status(200)
        .send({ message: "books fetched successfully", books: books });
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      const book: IBook | null = await this.bookService.getById(bookId);
      res
        .status(200)
        .send({ message: "book fetched successfully", book: book });
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public createNew = async (req: Request, res: Response): Promise<void> => {
    try {
      const authToken = req.headers.authorization;
      if (authToken) {
        const decoded = jwt.verify(authToken, "123") as ILogin;
        const user = await this.userService.getByEmail(decoded.email) as IUser;
        const createdBook: IBook | null = await this.bookService.createNew(
          { ...req.body, createdBy: user._id, updatedBy: user._id }
        );
        res
          .status(201)
          .send({ message: "book created successfully", book: createdBook });
      }
      else {
        res
          .status(403)
          .send({ message: "auth failed" });
      }

    } catch (error) {
      res.status(404).send(error);
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;

      const authToken = req.headers.authorization;

      if (authToken) {
        const decoded = jwt.verify(authToken, "123") as ILogin;

        const user = await this.userService.getByEmail(decoded.email) as IUser;
        const updatedDetails = { ...req.body, updatedBy: user._id };
        const updatedBook: IBook | null = await this.bookService.update(
          bookId,
          updatedDetails
        );
        res
          .status(201)
          .send({ message: "book updated successfully", book: updatedBook });
      }
      else {
        res
          .status(406)
          .send({ message: "auth failed" });
      }


    } catch (error) {
      res.status(404).send(error);
    }
  };

  public deleteAll = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.bookService.deleteAll();
      res.status(201).send({ message: "all books deleted successfully" });
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      const deletedBook = await this.bookService.delete(bookId);
      res
        .status(201)
        .send({ message: "book deleted successfully", book: deletedBook });
    } catch (error) {
      res.status(404).send(error);
    }
  };


  // public search = async (req: Request, res: Response) => {
  //   try {
  //     //eslint-disable-next-line
  //     const query: any = req.query;

  //     console.log("headers", req.headers);


  //     const allCategories = [
  //       "fiction",
  //       "mystery",
  //       "arts",
  //       "science",
  //       "romance",
  //       "horror",
  //       "religion",
  //       "philosophy",
  //       "history",
  //       "poetry",
  //       "biography",
  //       "technology",
  //     ];

  //     const allLanguages = [
  //       "english",
  //       "hindi",
  //       "sanskrit",
  //       "telugu",
  //       "tamil",
  //       "bengali",
  //     ];

  //     const sortOptions = [
  //       "newest",
  //       "price low to high",
  //       "price high to low",
  //       "title",
  //       "popularity",
  //     ];

  //     let pipeline: mongoose.PipelineStage[] = [];


  //     if (Object.keys(query).includes("search")) {
  //       const searchQuery: string = query["search"];


  //       if (searchQuery.trim() !== "") {


  //         if(mongoose.isValidObjectId(searchQuery)){
  //           const particularBook = await Book.find({_id: searchQuery});

  //           return res.status(200).send({books : particularBook});
  //         }

  //         pipeline.push({
  //           $match: { $text: { $search: searchQuery, $caseSensitive: false } },
  //         });
  //       }
  //     }

  //     let andConditions = [];

  //     let categoryToFilter,
  //       languageToFilter,
  //       minPrice,
  //       maxPrice,
  //       minRating,
  //       skip,
  //       limit;

  //     if (Object.keys(query).includes("category")) {
  //       if (Array.isArray(query["category"]))
  //         categoryToFilter = query["category"];
  //       else categoryToFilter = Array(query["category"]);

  //       andConditions.push({ category: { $in: categoryToFilter } });
  //     }

  //     if (Object.keys(query).includes("language")) {
  //       if (Array.isArray(query["language"]))
  //         languageToFilter = query["language"];
  //       else languageToFilter = Array(query["language"]);

  //       andConditions.push({ "moreDetails.text_language": { $in: languageToFilter } });
  //     }

  //     if (Object.keys(query).includes("price.from")) {
  //       minPrice = Number(query["price.from"]);
  //       andConditions.push({ price: { $gte: minPrice } })
  //     }

  //     if (Object.keys(query).includes("price.to")) {
  //       maxPrice = Number(query["price.to"]);
  //       andConditions.push({ price: { $lte: maxPrice } })
  //     }

  //     if (Object.keys(query).includes("rating")) {
  //       if (query["rating"] === "aboveThree") {
  //         minRating = 3;
  //       } else {
  //         minRating = 4;
  //       }
  //       andConditions.push({ rating: { $gte: minRating } })
  //     }

  //     if (andConditions.length > 0) {
  //       pipeline = pipeline.concat([
  //         {
  //           $match: {
  //             $and: andConditions
  //           }
  //         }
  //       ])
  //     }

  //     if (Object.keys(query).includes("sortBy")) {
  //       if (query["sortBy"] === sortOptions[1]) {
  //         pipeline = pipeline.concat([
  //           {
  //             $sort: { price: 1 },
  //           },
  //         ]);
  //       } else if (query["sortBy"] === sortOptions[2]) {
  //         pipeline = pipeline.concat([
  //           {
  //             $sort: { price: -1 },
  //           },
  //         ]);
  //       }
  //       if (query["sortBy"] === sortOptions[3]) {
  //         pipeline = pipeline.concat([
  //           {
  //             $sort: { title: 1 },
  //           },
  //         ]);
  //       }
  //       if (query["sortBy"] === sortOptions[4]) {
  //         pipeline = pipeline.concat([
  //           {
  //             $sort: { rating: -1 },
  //           },
  //         ]);
  //       }
  //     } else {
  //       pipeline = pipeline.concat([
  //         {
  //           $sort: { createdAt: 1 },
  //         },
  //       ]);
  //     }

  //     if (Object.keys(query).includes("skip")) {
  //       skip = Number(query["skip"]);
  //     } else {
  //       skip = 0;
  //     }

  //     if (Object.keys(query).includes("limit")) {
  //       limit = Number(query["limit"]);
  //     } else {
  //       limit = 10;
  //     }

  //     pipeline = pipeline.concat([
  //       {
  //         $skip: skip,
  //       },
  //       {
  //         $limit: limit,
  //       }
  //     ]);

  //     const [books, count] = await Promise.all([
  //       Book.aggregate(pipeline).exec(),
  //       Book.countDocuments(pipeline).exec()
  //     ]);

  //     console.log("count docs", count);


  //     res
  //       .status(200)
  //       .send({ message: "books fetched successfully", books: books, count : count });
  //   } catch (error) {
  //     res.status(404).send(error);
  //   }
  // };

  public search = async (req: Request, res: Response) => {
    try {
      const query: any = req.query;
      console.log("headers", req.headers);

      const allCategories = [
        "fiction",
        "mystery",
        "arts",
        "science",
        "romance",
        "horror",
        "religion",
        "philosophy",
        "history",
        "poetry",
        "biography",
        "technology",
      ];

      const allLanguages = [
        "english",
        "hindi",
        "sanskrit",
        "telugu",
        "tamil",
        "bengali",
      ];

      const sortOptions = [
        "newest",
        "price low to high",
        "price high to low",
        "title",
        "popularity",
      ];

      let findConditions: any = {};

      if (Object.keys(query).includes("search")) {
        const searchQuery: string = query["search"];
        if (searchQuery.trim() !== "") {
          if (mongoose.isValidObjectId(searchQuery)) {
            const particularBook = await Book.find({ _id: searchQuery });
            return res.status(200).send({ books: particularBook });
          }
          findConditions.$text = { $search: searchQuery, $caseSensitive: false };
        }
      }

      if (Object.keys(query).includes("category")) {
        findConditions.category = { $in: [].concat(query["category"]) };
      }

      if (Object.keys(query).includes("language")) {
        findConditions["moreDetails.text_language"] = {
          $in: [].concat(query["language"]),
        };
      }

      if (Object.keys(query).includes("price.from")) {
        findConditions.price = { ...findConditions.price, $gte: Number(query["price.from"]) };
      }

      if (Object.keys(query).includes("price.to")) {
        findConditions.price = { ...findConditions.price, $lte: Number(query["price.to"]) };
      }

      if (Object.keys(query).includes("rating")) {
        findConditions.rating = query["rating"] === "aboveThree" ? { $gte: 3 } : { $gte: 4 };
      }

      const sortByOption =
        sortOptions.indexOf(query["sortBy"]) !== -1 ? query["sortBy"] : sortOptions[0];

      let sortCondition: any = {};

      if (sortByOption === sortOptions[1]) {
        sortCondition.price = 1;
      } else if (sortByOption === sortOptions[2]) {
        sortCondition.price = -1;
      } else if (sortByOption === sortOptions[3]) {
        sortCondition.title = 1;
      } else if (sortByOption === sortOptions[4]) {
        sortCondition.rating = -1;
      } else {
        sortCondition.createdAt = 1;
      }

      const [books, count] = await Promise.all([
        Book.find(findConditions)
          .sort(sortCondition)
          .skip(Number(query["skip"]) || 0)
          .limit(Number(query["limit"]) || 10)
          .select(["_id", "title", "author.name", "price", "rating", "createdAt"]),
        Book.countDocuments(findConditions),
      ]);

      console.log("count docs", count);

      res.status(200).send({ message: "books fetched successfully", books, count });
    } catch (error) {
      res.status(404).send(error);
    }
  };


  public getAllBulkUploads = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const bulkUploads: IBulkUpload[] | null = await BulkUpload.find().limit(50);
      res.status(200).send({
        message: "fetching all bulk uploads data",
        bulkUploads: bulkUploads,
      });
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public getBulkUploadErrorDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const bulkUploadErrorDetail: IBulkError[] | null =
        await BulkErrorDetail.find({ session_id: sessionId }).limit(20);
      console.log(bulkUploadErrorDetail);

      res.status(200).send({
        message: "fetching all bulk uploads error details",
        bulkUploadErrorDetail: bulkUploadErrorDetail,
      });
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public deleteBulkUploadErrors = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      await BulkErrorDetail.deleteMany({});
      res.status(201).send({ message: "all bulk errors deleted successfully" });
    } catch (error) {
      res
        .status(404)
        .send({ message: "some error occured in deleting all bulk errors" });
    }
  };

  public bulkUsingPapaParse2 = async (req: Request, res: Response) => {

    const authToken = req.headers.authorization;
    let user: IUser;
    if (authToken) {
      const decoded = jwt.verify(authToken, "123") as ILogin;
      user = await this.userService.getByEmail(decoded.email) as IUser;
      // const createdBook: IBook | null = await this.bookService.createNew(
      //   { ...req.body, createdBy: user._id, updatedBy: user._id }
      // )
    }

    try {
      const session_id: string = uuidv4();
      const startTime = Date.now();
      const batchSize = 1000;
      let parsedDataCount = 0;
      let errorCount = 0;
      // eslint-disable-next-line
      let bulkOps: any[] = [];
      // eslint-disable-next-line
      let bulkUploadErrors: any[] = [];
      const csvFile: Express.Multer.File | undefined = req.file;
      console.log(csvFile?.path);

      // eslint-disable-next-line
      function transformRowData(obj: any) {
        const result = {};

        for (const key in obj) {
          const keys = key.split(".");
          // eslint-disable-next-line
          let currentObj: any = result;

          for (let i = 0; i < keys.length - 1; i++) {
            currentObj[keys[i]] = currentObj[keys[i]] || {};
            currentObj = currentObj[keys[i]];
          }

          currentObj[keys[keys.length - 1]] = obj[key];
        }

        return result;
      }

      if (csvFile) {
        const filePath = csvFile.path;

        const readStream = fs.createReadStream(filePath);

        Papa.parse(readStream, {
          header: true,
          dynamicTyping: true,
          worker: true,

          step: async function (result, parser) {
            try {
              const rowData = result.data;
              // eslint-disable-next-line
              let transformedObject: any = transformRowData(rowData);

              parsedDataCount += 1;

              const { error } = bookSchema.validate(transformedObject, {
                abortEarly: false,
              });

              if (error) {
                errorCount += 1;
                const bulkErrorDetail: IBulkError = {
                  rowNumber: parsedDataCount,
                  errorDetails: error.message.toString(),
                  session_id: session_id,
                };

                bulkUploadErrors.push({
                  updateOne: {
                    filter: { rowNumber: parsedDataCount },
                    update: bulkErrorDetail,
                    upsert: true,
                  },
                });
                if (bulkUploadErrors.length === batchSize) {
                  console.log(
                    "parser pause ho gya error write mei",
                    parser.pause()
                  );
                  const bulkErrorWriteStartTime = Date.now();
                  const bulkErrorWriteResult = await BulkErrorDetail.bulkWrite(
                    bulkUploadErrors,
                    { ordered: false }
                  );
                  console.log(
                    "bulk error time taken:",
                    (Date.now() - bulkErrorWriteStartTime) / 1000
                  );
                  console.log("bulk write error result", bulkErrorWriteResult);

                  bulkUploadErrors = [];
                  console.log(
                    "parser resume ho gya error write mei",
                    parser.resume()
                  );
                }
              } else {
                bulkOps.push({
                  updateOne: {
                    filter: { title: transformedObject.title },
                    update: { ...transformedObject, createdBy: user._id, updatedBy: user._id },
                    upsert: true,
                  },
                });

                if (bulkOps.length === batchSize) {
                  console.log(
                    "parser pause ho gya book write mei",
                    parser.pause()
                  );
                  const bulkWriteStartTime = Date.now();
                  const bulkWriteResult = await Book.bulkWrite(bulkOps, {
                    ordered: false,
                  });

                  // console.log(
                  //   "bulk book time taken:",
                  //   (Date.now() - bulkWriteStartTime) / 1000
                  // );
                  // console.log("bulk write book result", bulkWriteResult);
                  bulkOps = [];
                  console.log(
                    "parser resume ho gya book write mei",
                    parser.resume()
                  );
                }
              }
            } catch (error) {
              const endTime = Date.now();
              const bulkUploadRecord: IBulkUpload = {
                recordsProcessed: parsedDataCount,
                totalErrors: errorCount,
                timeTaken: (endTime - startTime) / 1000,
                session_id: session_id,
                createdBy: user._id,
                updatedBy: user._id
              };

              await BulkUpload.insertMany(bulkUploadRecord);
            }
          },
          complete: async function () {
            if (bulkOps.length > 0) {
              const bulkWriteStartTime = Date.now();
              const bulkWriteResult = await Book.bulkWrite(bulkOps, {
                ordered: false,
              });

              console.log(
                "bulk book time taken:",
                (Date.now() - bulkWriteStartTime) / 1000
              );
              console.log("bulk write book result", bulkWriteResult);
              bulkOps = [];
            }

            if (bulkUploadErrors.length > 0) {
              const bulkErrorWriteStartTime = Date.now();
              const bulkErrorWriteResult = await BulkErrorDetail.bulkWrite(
                bulkUploadErrors,
                { ordered: false }
              );
              console.log(
                "bulk error time taken:",
                (Date.now() - bulkErrorWriteStartTime) / 1000
              );
              console.log("bulk write error result", bulkErrorWriteResult);

              bulkUploadErrors = [];
            }

            const endTime = Date.now();
            console.log((endTime - startTime) / 1000);

            const bulkUploadRecord: IBulkUpload = {
              recordsProcessed: parsedDataCount,
              totalErrors: errorCount,
              timeTaken: (endTime - startTime) / 1000,
              session_id: session_id,
              createdBy: user._id,
              updatedBy: user._id
            };

            if (parsedDataCount) {
              await BulkUpload.insertMany(bulkUploadRecord);
            }

            console.log(bulkUploadRecord);
            console.log("check the db");
            return res.status(200).send({ message: "file processed successfully" });
          },
          error: async (error) => {
            if (bulkOps.length > 0) {
              await Book.bulkWrite(bulkOps);
              bulkOps = [];
            }

            if (bulkUploadErrors.length > 0) {
              await BulkErrorDetail.bulkWrite(bulkUploadErrors);
              bulkUploadErrors = [];
            }

            const bulkErrorDetail: IBulkError = {
              rowNumber: parsedDataCount,
              errorDetails: error.message.toString(),
              session_id: session_id,
            };

            await BulkErrorDetail.insertMany(bulkErrorDetail);

            const endTime = Date.now();
            const bulkUploadRecord: IBulkUpload = {
              recordsProcessed: parsedDataCount,
              totalErrors: errorCount,
              timeTaken: (endTime - startTime) / 1000,
              session_id: session_id,
              createdBy: user._id,
              updatedBy: user._id
            };

            await BulkUpload.insertMany(bulkUploadRecord);
            return res.status(404).send({ message: "some error occured in processing the file" });
          },
        });

      } else {
        return res.status(406).send({ message: "no file selected" });
      }
    } catch (error) {
      return res.status(404).send(error);
    }
  };

}
export default BookController;
