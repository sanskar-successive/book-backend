import { workerData, parentPort } from "worker_threads";
import fs from "fs";
import csvtojson from "csvtojson";
import Book from "./modules/book/repositories/models/book.model";
import DBConnection from "./lib/config/dbConnection";




const processCSV =  () => {
  try {

    const dbConnection = DBConnection.getInstance();
    dbConnection.connectDB();

    const filePath = workerData.filePath;
    const batchSize = 10;

    // eslint-disable-next-line
    let bulkOps: any = [];

    let rowCount = 0;

    const csvStream = fs
      .createReadStream(filePath)
      .pipe(csvtojson({ checkType: true }));


    // Process each CSV row as a JSON object
    csvStream.on("data", async (buffer) => {
      const jsonString = buffer.toString("utf-8");
      // Validate the JSON object (implement your validation logic here)
      // const isValid = validateJSON(data);

      // if (isValid) {
      // Add the operation to the bulk write array

      // console.log(jsonString);
      
      const data = JSON.parse(jsonString);

      // console.log(data);
      

      // console.log(data);
      //   console.log('\n')
      bulkOps.push({
        insertOne: {
          document: data,
        },
      });

      // bulkOps.push(data);

      // If the batch size is reached, execute the bulk write operation
      if (bulkOps.length === batchSize) {
        executeBulkWrite(bulkOps);

        bulkOps = []; // Reset bulkOps array
      }

      rowCount++;
      // }
    });


    // Handle the end of the CSV stream
    csvStream.on("finish", async () => {
      // Insert any remaining documents in the bulk write array
      if (bulkOps.length > 0) {
        executeBulkWrite(bulkOps);
      }

      // Send a message back to the main thread
      parentPort?.postMessage(
        `Processed ${rowCount} rows. CSV processing completed.`
      );
    });
  } catch (error) {
    // Handle errors and send them back to the main thread
    parentPort?.postMessage(`Error in CSV processing ${error}`);
  }
};

processCSV();
// eslint-disable-next-line
const executeBulkWrite = async (operations: any) => {
  try {
    await Book.bulkWrite(operations, { ordered: false });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during bulk write:", error);
      parentPort?.postMessage(`Error during bulk write: ${error.message}`);
    }
  }
};
