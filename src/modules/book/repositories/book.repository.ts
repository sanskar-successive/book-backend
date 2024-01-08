import { ObjectId } from "mongoose";
import BaseRepository from "../../../lib/base/base.repository";
import { IBook } from "../entities/IBook";
import IBulkUpload from "../entities/IBulkUpload";
import Book from "./models/book.model";
import BulkUpload from "./models/bulkUpload.model";

class BookRepository extends BaseRepository<IBook> {
  constructor() {
    super(Book);
  }

  public deleteAll = async (): Promise<void> => {
    await Book.deleteMany({});
  };
// eslint-disable-next-line
  public bulkWrite = async (books : any) : Promise<void> =>{
    await Book.bulkWrite(books, {ordered:false});
  }


  public getAllBulkUploads = async () : Promise<IBulkUpload[]> =>{
    return await BulkUpload.find().limit(10);
  }
}
export default BookRepository;
