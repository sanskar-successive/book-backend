import BaseRepository from "../../../lib/base/base.repository";
import { IBook } from "../entities/IBook";
import Book from "./models/book.model";


class BookRepository extends BaseRepository<IBook> {
  constructor() {
    super(Book);
  }

  public deleteAll = async (): Promise<void> => {
    await Book.deleteMany({});
  };
}
export default BookRepository;
