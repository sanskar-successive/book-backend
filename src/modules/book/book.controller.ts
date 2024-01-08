import { Request, Response } from "express";
import BookService from "./book.service";
import { IBook } from "./entities/IBook";
import Papa from "papaparse";
import fs from "fs";
import { Worker } from "worker_threads";
import Book from "./repositories/models/book.model";
import mongoose from "mongoose";
import { bookSchema } from "./book.validation";
import BulkUpload from "./repositories/models/bulkUpload.model";
import IBulkUpload from "./entities/IBulkUpload";
import IBulkError from "./entities/IBulkError";
import BulkErrorDetail from "./repositories/models/bulkError.model";
import { v4 as uuidv4 } from "uuid";

class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.query);
      const books: IBook[] | null = await this.bookService.getAll();
      res
        .status(200)
        .json({ message: "books fetched successfully", books: books });
    } catch (error) {
      res.status(404).json(error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      const book: IBook | null = await this.bookService.getById(bookId);
      res
        .status(200)
        .json({ message: "book fetched successfully", book: book });
    } catch (error) {
      res.status(404).json(error);
    }
  };

  public createNew = async (req: Request, res: Response): Promise<void> => {
    try {
      const createdBook: IBook | null = await this.bookService.createNew(
        req.body
      );
      res
        .status(201)
        .json({ message: "book created successfully", book: createdBook });
    } catch (error) {
      res.status(404).json(error);
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      const updatedDetails = req.body;
      const updatedBook: IBook | null = await this.bookService.update(
        bookId,
        updatedDetails
      );
      res
        .status(201)
        .json({ message: "book updated successfully", updatedBook });
    } catch (error) {
      res.status(404).json(error);
    }
  };

  public deleteAll = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.bookService.deleteAll();
      res.status(201).json({ message: "all books deleted successfully" });
    } catch (error) {
      res.status(404).json(error);
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      const deletedBook = await this.bookService.delete(bookId);
      res
        .status(201)
        .json({ message: "book deleted successfully", deletedBook });
    } catch (error) {
      res.status(404).json(error);
    }
  };

  // public bulkTest = async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     const csvFile: Express.Multer.File | undefined = req.file;
  //     console.log(csvFile?.path);

  //     if (csvFile) {
  //       const filePath = csvFile.path;

  //       const numThreads = 4;

  //       const fileStats = fs.statSync(filePath);
  //       const fileSize = fileStats.size;
  //       const chunkSize = Math.ceil(fileSize / numThreads);

  //       for (let i = 0; i < numThreads; i++) {
  //         const start = i * chunkSize;
  //         const end = Math.min(fileSize, (i + 1) * chunkSize - 1);

  //         const worker = new Worker("./dist/worker2.js", {
  //           workerData: { id: i, start, end, filePath: filePath },
  //         });

  //         const startTime = Date.now();

  //         worker.on("message", (message) => {
  //           const endTime = Date.now();
  //           console.log((endTime - startTime) / 1000);

  //           message["timeTaken"] = (endTime - startTime) / 1000;

  //           console.log(`worker ${i} thread message ==> `);
  //           console.log(message);
  //         });

  //         worker.on("error", (error) => {
  //           console.error(`worker ${i} thread error ==> ${error}`);
  //         });

  //         worker.on("exit", (code) => {
  //           if (code !== 0) {
  //             console.error(`Worker ${i} thread exited with code ${code}`);
  //           }
  //         });
  //       }
  //       res.send("CSV processing started. Check console for updates.");
  //     } else {
  //       res.status(404).json("no csv file selected");
  //     }
  //   } catch (error) {
  //     res.status(404).json(error);
  //   }
  // };

  public search = async (req: Request, res: Response) => {
    try {
      //eslint-disable-next-line
      const query: any = req.query;

      console.log("query",query);

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

      let pipeline: mongoose.PipelineStage[] = [];

      if (Object.keys(query).includes("search")) {
        const searchQuery: string = query["search"];
        if (searchQuery.trim() !== "") {
          pipeline.push({
            $match: { $text: { $search: searchQuery, $caseSensitive: false } },
          });
        }
      }

      let categoryToFilter,
        languageToFilter,
        minPrice,
        maxPrice,
        minRating,
        skip,
        limit;

      if (Object.keys(query).includes("category")) {
        if (Array.isArray(query["category"]))
          categoryToFilter = query["category"];
        else categoryToFilter = Array(query["category"]);
      } else {
        categoryToFilter = allCategories;
      }

      if (Object.keys(query).includes("language")) {
        if (Array.isArray(query["language"]))
          languageToFilter = query["language"];
        else languageToFilter = Array(query["language"]);
      } else {
        languageToFilter = allLanguages;
      }

      if (Object.keys(query).includes("price.from")) {
        minPrice = Number(query["price.from"]);
      } else {
        minPrice = 50;
      }

      if (Object.keys(query).includes("price.to")) {
        maxPrice = Number(query["price.to"]);
      } else {
        maxPrice = 2000;
      }

      if (Object.keys(query).includes("rating")) {
        if (query["rating"] === "aboveThree") {
          minRating = 3;
        } else {
          minRating = 4;
        }
      } else {
        minRating = 0;
      }

      pipeline = pipeline.concat([
        {
          $match: {
            $and: [
              { category: { $in: categoryToFilter } },
              { "moreDetails.text_language": { $in: languageToFilter } },
              { price: { $gte: minPrice, $lte: maxPrice } },
              { rating: { $gte: minRating, $lte: 5 } },
            ],
          },
        },
      ]);

      if (Object.keys(query).includes("sortBy")) {
        if (query["sortBy"] === sortOptions[1]) {
          pipeline = pipeline.concat([
            {
              $sort: { price: 1 },
            },
          ]);
        } else if (query["sortBy"] === sortOptions[2]) {
          pipeline = pipeline.concat([
            {
              $sort: { price: -1 },
            },
          ]);
        }
        if (query["sortBy"] === sortOptions[3]) {
          pipeline = pipeline.concat([
            {
              $sort: { title: 1 },
            },
          ]);
        }
        if (query["sortBy"] === sortOptions[4]) {
          pipeline = pipeline.concat([
            {
              $sort: { rating: -1 },
            },
          ]);
        }
      } else {
        pipeline = pipeline.concat([
          {
            $sort: { createdAt: 1 },
          },
        ]);
      }

      if (Object.keys(query).includes("skip")) {
        skip = Number(query["skip"]);
      } else {
        skip = 0;
      }

      if (Object.keys(query).includes("limit")) {
        limit = Number(query["limit"]);
      } else {
        limit = 10;
      }

      pipeline = pipeline.concat([
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

      const books = await Book.aggregate(pipeline).exec();

      console.log(books);
      

      res
        .status(200)
        .json({ message: "books fetched successfully", books: books });
    } catch (error) {
      res.status(404).json(error);
    }
  };

  public getAllBulkUploads = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const bulkUploads: IBulkUpload[] | null = await BulkUpload.find().limit(
        10
      );
      res.status(200).json({
        message: "fetching all bulk uploads data",
        bulkUploads: bulkUploads,
      });
    } catch (error) {
      res.status(404).json(error);
    }
  };

  public getBulkUploadErrorDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const bulkUploadErrorDetail: IBulkError[] | null =
        await BulkErrorDetail.find({ session_id: sessionId }).limit(10);
      res.status(200).json({
        message: "fetching all bulk uploads error details",
        bulkUploadErrorDetail: bulkUploadErrorDetail,
      });
    } catch (error) {
      res.status(404).json(error);
    }
  };

  public deleteBulkUploadErrors = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      await BulkErrorDetail.deleteMany({});
      res.status(201).json({ message: "all bulk errors deleted successfully" });
    } catch (error) {
      res
        .status(404)
        .json({ message: "some error occured in deleting all bulk errors" });
    }
  };

  public bulkUsingPapaParse2 = async (req: Request, res: Response) => {
    try {
      const session_id: string = uuidv4();
      const startTime = Date.now();
      const batchSize = 1000;
      let parsedDataCount = 0;
      let errorCount = 0;
      // eslint-disable-next-line
      let bulkOps: any[] = [];
      let bulkOpsCopy: any[] = [];
      // eslint-disable-next-line
      let bulkUploadErrors: any[] = [];
      let bulkUploadErrorsCopy: any[] = [];
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
              const transformedObject: any = transformRowData(rowData);

              parsedDataCount += 1;

              const { error } = bookSchema.validate(transformedObject, {
                abortEarly: false,
              });

              if (error) {
                errorCount += 1;
                const bulkErrorDetail: IBulkError = {
                  rowNumber: parsedDataCount,
                  errorDetails: Object(error.message),
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
                    update: transformedObject,
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

                  console.log(
                    "bulk book time taken:",
                    (Date.now() - bulkWriteStartTime) / 1000
                  );
                  console.log("bulk write book result", bulkWriteResult);
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
              };

              await BulkUpload.insertMany(bulkUploadRecord);
              console.log("mongo db bulk write error", error);
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
            };

            if (parsedDataCount) {
              await BulkUpload.insertMany(bulkUploadRecord);
            }

            console.log(bulkUploadRecord);
            console.log("check the db");
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
              errorDetails: Object(error.message),
              session_id: session_id,
            };

            await BulkErrorDetail.insertMany(bulkErrorDetail);

            const endTime = Date.now();
            const bulkUploadRecord: IBulkUpload = {
              recordsProcessed: parsedDataCount,
              totalErrors: errorCount,
              timeTaken: (endTime - startTime) / 1000,
              session_id: session_id,
            };

            await BulkUpload.insertMany(bulkUploadRecord);
          },
        });

        res.status(200).send({ message: "processing started" });
      } else {
        res.status(406).send({ message: "no file selected" });
      }
    } catch (error) {
      return res.status(404).json(error);
    }
  };
}
export default BookController;
