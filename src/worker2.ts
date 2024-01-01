import { workerData, parentPort } from "worker_threads";
import fs from "fs";
import { Transform } from "stream";
import DBConnection from "./lib/config/dbConnection";
import { bookSchema } from "./modules/book/book.validation";
import BookService from "./modules/book/book.service";
import csvParser from "csv-parser";

interface IError {
  row: number;
  data: string;
  err: unknown;
}


const batchSize = 4;
// eslint-disable-next-line
let bulkOps: any = [];
let errorData: IError[] = [];
let rowCount = 0;

// eslint-disable-next-line
const processCSV = (start:any,end:any) => {
  try {
    const dbConnection = DBConnection.getInstance();
    // console.log(dbConnection);
    dbConnection.connectDB();

    const bookService = new BookService();

    bulkOps = [];
    errorData = [];
    rowCount = 0;

    const filePath = workerData.filePath;

    let errorCount = 0;

    const validationCheckStream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        try {
          rowCount += 1;
          // console.log(rowCount);

          const jsonData = JSON.parse(chunk.toString());
          const { error } = bookSchema.validate(jsonData, {
            abortEarly: false,
          });

          if (error) {
            // agar error aati hai toh

            errorData.push({
              row: rowCount,
              data: JSON.stringify(jsonData),
              err: error,
            });

            throw new Error("Validation error");
          }

          this.push(chunk);
          callback();
        } catch (error) {
          errorCount += 1;
          callback();
        }
      },
    });

    const dbWriteStream = new Transform({
      objectMode: true,
      async transform(chunk, encoding, callback) {
        try {
          const data = JSON.parse(chunk.toString("utf-8"));

          const jsonData = JSON.parse(chunk.toString());

          console.log(jsonData);
          

          // console.log(jsonData);

          // if(jsonData.rating===0){
          //   console.log(jsonData);

          //   throw new Error('db write error');
          // }

          bulkOps.push({
            insertOne: {
              document: data,
            },
          });

          if (bulkOps.length === batchSize) {
            // await executeBulkWrite(bulkOps);
            await bookService.bulkWrite(bulkOps);
            bulkOps = [];
          }

          callback();
        } catch (error) {
          // console.error("Error during bulk write:", error);

          errorData.push({
            row: rowCount,
            data: `some error from ${rowCount} to ${rowCount + batchSize}`,
            err: error,
          });
          errorCount += 1;
          callback();
        }
      },
    });


    // const start1 : any = findStartOfFile(filePath, workerData.start, workerData.end);
    const readStream = fs.createReadStream(filePath, { start, end });

    readStream
      // .pipe(csvtojson({ checkType: true,ignoreEmpty:true }))
      // .pipe(fastCsv.parse({ headers: true, ignoreEmpty: true }))
      .pipe(csvParser())
      .on('data', (data)=>{
        console.log(JSON.parse(data.toString()));
        
      })
      .pipe(validationCheckStream)
      .on("error", async (error) => {
        // if (validatedData.error) {
        // await handleError("Validation", new Error(error));

        console.log("error hai validation wale mei", error);

        /* Store the error or handle it as needed */
        // }
      })
      .pipe(dbWriteStream)
      .on("error", async (error) => {
        // await handleError("Writing to MongoDB", error, null)
        console.log("error hai db write mei", error);
      })
      .on("finish", async () => {
        // Insert any remaining documents in the bulk write array
        if (bulkOps.length > 0) {
          await bookService.bulkWrite(bulkOps);
          // await executeBulkWrite(bulkOps);
          // console.log("Bulk write successful.");
        }

        // Send a message back to the main thread

        // send message about bulk write operations if any

        // console.log(errorData);

        // if(errorCount){
        //   console.log(errorData);
          
        // }

        parentPort?.postMessage({
          rowsProcessed: rowCount,
          errorOccured: errorCount,
          timeTaken: 0,
        });
      });
  } 
  // eslint-disable-next-line
  catch (error: any) {
    // Handle errors and send them back to the main thread

    if (error.code === 11000)
      parentPort?.postMessage({
        customMessage : "Duplicate key error during bulk write:",
        message: error.message
      }
      );
    else parentPort?.postMessage(error.message);
  }
};



// eslint-disable-next-line
// const executeBulkWrite = async (operations: any) => {
//   try {
//     const bookService = new BookService();
//     if (operations.length > 0) {
//       await bookService.bulkWrite(operations);
//       // console.log("Bulk write successful.");
//     }
//   } catch (error) {
//     errorData.push({
//       row : rowCount,
//       data : `some error from ${rowCount} to ${rowCount+batchSize}`,
//       err : error
//     })
//     console.error("Error during bulk write:", error);
//     parentPort?.postMessage(errorData);
//   }
// };


// processCSV(workerData.start, workerData.end);



// const findStartOfFile = (filePath: any, startPosition: any, endPosition: any) => {
//   const buffer = Buffer.alloc(1024); // Adjust the buffer size as needed


//   let low = startPosition;
//   let high = endPosition;

//   while (low < high) {
//     const mid = Math.floor((low + high) / 2);

//     const fd = fs.openSync(filePath, 'r');
//     fs.readSync(fd, buffer, 0, buffer.length, mid);
//     fs.closeSync(fd);

//     const isNewline = buffer.indexOf('\n') !== -1;

//     if (isNewline) {
//       high = mid;
//     } else {
//       low = mid + 1;
//     }
//   }

//   // Return the adjusted start position
//   return low;
// };






processCSV(workerData.start, workerData.end);




