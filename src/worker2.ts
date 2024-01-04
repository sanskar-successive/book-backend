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
          


          bulkOps.push({
            insertOne: {
              document: data,
            },
          });

          if (bulkOps.length === batchSize) {
            
            await bookService.bulkWrite(bulkOps);
            bulkOps = [];
          }

          callback();
        } catch (error) {
         

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


    
    const readStream = fs.createReadStream(filePath, { start, end });

    readStream
      
      .pipe(csvParser())
      .on('data', (data)=>{
        console.log(JSON.parse(data.toString()));
        
      })
      .pipe(validationCheckStream)
      .on("error", async (error) => {
        

        console.log("error hai validation wale mei", error);

        
      })
      .pipe(dbWriteStream)
      .on("error", async (error) => {
        
        console.log("error hai db write mei", error);
      })
      .on("finish", async () => {
        
        if (bulkOps.length > 0) {
          await bookService.bulkWrite(bulkOps);
         
        }

      
        parentPort?.postMessage({
          rowsProcessed: rowCount,
          errorOccured: errorCount,
          timeTaken: 0,
        });
      });
  } 
  // eslint-disable-next-line
  catch (error: any) {
   

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




