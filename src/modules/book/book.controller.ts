import { Request, Response } from "express";
import BookService from "./book.service";
import { IBook } from "./entities/IBook";
import Papa from "papaparse";
import fs from "fs";
import Book from "./repositories/models/book.model";
import { bookSchema } from "./book.validation";
import BulkUpload from "./repositories/models/bulkUpload.model";
import IBulkUpload from "./entities/IBulkUpload";
import IBulkError from "./entities/IBulkError";
import BulkErrorDetail from "./repositories/models/bulkError.model";
import { v4 as uuidv4 } from "uuid";
import { transformRowData } from "./utils/tranformObj";
import { buildPipeline } from "./utils/buildPipeline";


class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }
  public getAll = async (req: Request, res: Response) => {
    try {
      console.log(req.query);
      const books: IBook[] | null = await this.bookService.getAll();
      res
        .status(200)
        .send({ message: "books fetched successfully", books: books });
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public getById = async (req: Request, res: Response) => {
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

  public createNew = async (req: Request, res: Response) => {
    try {
      const createdBook: IBook | null = await this.bookService.createNew(
        req.body
      );
      res
        .status(201)
        .send({ message: "book created successfully", book: createdBook });
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const { bookId } = req.params;
      const updatedDetails = req.body;
      const updatedBook: IBook | null = await this.bookService.update(
        bookId,
        updatedDetails
      );
      res
        .status(201)
        .send({ message: "book updated successfully", book: updatedBook });
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public deleteAll = async (req: Request, res: Response) => {
    try {
      await this.bookService.deleteAll();
      res.status(201).send({ message: "all books deleted successfully" });
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public delete = async (req: Request, res: Response) => {
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


  public search = async (req: Request, res: Response) => {
    try {
      //eslint-disable-next-line
      const query: any = req.query;
      const pipeline = buildPipeline(query);
      const books = await Book.aggregate(pipeline).exec();
      res
        .status(200)
        .send({ message: "books fetched successfully", books: books });
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public getAllBulkUploads = async (
    req: Request,
    res: Response
  ) => {
    try {
      const bulkUploads: IBulkUpload[] | null = await BulkUpload.find().limit(
        10
      );
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
  ) => {
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
  ) => {
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
    try {
      const session_id: string = uuidv4(), startTime = Date.now(), batchSize = 1000;
      // eslint-disable-next-line
      let parsedDataCount = 0, errorCount = 0, bulkOps: any[] = [], bulkUploadErrors: any[] = [];
      const csvFile: Express.Multer.File | undefined = req.file;

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

              const { error } = bookSchema.validate(transformedObject, { abortEarly: false });

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
                  parser.pause()


                  await BulkErrorDetail.bulkWrite(
                    bulkUploadErrors,
                    { ordered: false }
                  );

                  bulkUploadErrors = [];

                  parser.resume()

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

                  parser.pause()


                  await Book.bulkWrite(bulkOps, {
                    ordered: false,
                  });

                  bulkOps = [];

                  parser.resume()

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

            }
          },
          complete: async function () {
            if (bulkOps.length > 0) {

              await Book.bulkWrite(bulkOps, {
                ordered: false,
              });
              bulkOps = [];
            }

            if (bulkUploadErrors.length > 0) {

              await BulkErrorDetail.bulkWrite(
                bulkUploadErrors,
                { ordered: false }
              );

              bulkUploadErrors = [];
            }

            const endTime = Date.now();


            const bulkUploadRecord: IBulkUpload = {
              recordsProcessed: parsedDataCount,
              totalErrors: errorCount,
              timeTaken: (endTime - startTime) / 1000,
              session_id: session_id,
            };

            if (parsedDataCount) {
              await BulkUpload.insertMany(bulkUploadRecord);
            }
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
            };

            await BulkUpload.insertMany(bulkUploadRecord);
          },
        });

        res.status(200).send({ message: "processing started" });
      } else {
        res.status(406).send({ message: "no file selected" });
      }
    } catch (error) {
      return res.status(404).send(error);
    }
  };

}
export default BookController;
