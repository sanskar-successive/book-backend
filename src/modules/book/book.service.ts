import BookRepository from "./repositories/book.repository";
import { IBook } from "./entities/IBook";

class BookService {
  private bookRepo: BookRepository;

  constructor() {
    this.bookRepo = new BookRepository();
  }

  public getAll = async (): Promise<IBook[] | null> => {
    return await this.bookRepo.getAll();
  };

  public getById = async (bookId: string): Promise<IBook | null> => {
    return await this.bookRepo.getById(bookId);
  };

  public createNew = async (book: IBook): Promise<IBook | null> => {
    return await this.bookRepo.createNew(book);
  };

  public update = async (
    bookId: string,
    updatedBook: IBook
  ): Promise<IBook | null> => {
    return await this.bookRepo.update(bookId, updatedBook);
  };

  public delete = async (bookId: string): Promise<IBook | null> => {
    return await this.bookRepo.delete(bookId);
  };

  public deleteAll = async (): Promise<void> => {
    await this.bookRepo.deleteAll();
  };

  // eslint-disable-next-line
  public bulkWrite = async (books: any): Promise<void> => {
    await this.bookRepo.bulkWrite(books);
  };

}

export default BookService;