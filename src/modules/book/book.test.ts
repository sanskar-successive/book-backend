import request from "supertest";
import DBConnection from "../../lib/config/dbConnection";
import Server from "../../server";
import BookController from "./book.controller";
import BookService from "./book.service";
import { Request, Response } from "express";
import { IBook } from "./entities/IBook";

const dbConnection = DBConnection.getInstance();
const server = Server.getInstance(dbConnection);

beforeEach(async () => {
  dbConnection.connectDB();
});

afterEach(async () => {
  dbConnection.closeDBConnection();
});

let testBookId: string;
const mockBook1 = {
  title: "mock book 1",
  coverImage: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=58",
  category: "horror",
  author: {
    name: "Stephen Miller",
    about:
      "Valetudo tonsor odit inflammatio. Statim aggredior vesper audacia them...",
  },
  rating: 3,
  price: 465,
  moreDetails: {
    publisher: "Yundt - O'Kon",
    firstPublished: new Date(),
    seller: "Wisoky LLC",
    language: "telugu",
    description:
      "Tabgo denuncio uter tutis consequuntur. Carbo aliqua molestiae demitto...",
    fileSize: 3070,
    pages: 561,
    verified: true,
    edition: 4,
  },
};
const mockBook2 = {
  title: "mock book 2",
  coverImage: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=58",
  category: "horror",
  author: {
    name: "Stephen Miller",
    about:
      "Valetudo tonsor odit inflammatio. Statim aggredior vesper audacia them...",
  },
  rating: 3,
  price: 465,
  moreDetails: {
    publisher: "Yundt - O'Kon",
    firstPublished: new Date(),
    seller: "Wisoky LLC",
    language: "telugu",
    description:
      "Tabgo denuncio uter tutis consequuntur. Carbo aliqua molestiae demitto...",
    fileSize: 3070,
    pages: 561,
    verified: true,
    edition: 4,
  },
};

describe("BookController", () => {
  let bookController: BookController;
  let bookService: BookService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    bookService = new BookService();
    bookController = new BookController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("getAll returns a list of books", async () => {
    // Mock the bookService.getAll method
    const mockBooks: IBook[] = [mockBook1, mockBook2];
    jest.spyOn(bookService, "getAll").mockResolvedValueOnce(mockBooks);

    // Call the getAll method with the mocked request and response
    await bookController.getAll(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert that the response status is 200 and json is called with the expected data
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
  });

  test("getAll handles errors correctly", async () => {
    // Mock an error in the bookService.getAll method
    const mockError = new Error("Test error");
    jest.spyOn(bookService, "getAll").mockRejectedValueOnce(mockError);

    // Call the getAll method with the mocked request and response
    await bookController.getAll(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert that the response status is 404 and json is called with the error
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(mockError);
  });
});

describe("GET /api/books", () => {
  test("should return all books", async () => {
    const res = await request(server.getApp()).get("/api/books");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });

  test("should not return books", async () => {
    const res = await request(server.getApp()).get("/api/books");
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /api/books", () => {
  test("should create a book", async () => {
    const res = await request(server.getApp())
      .post("/api/books")
      .send({
        title: "Test book created",
        coverImage: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=58",
        category: "horror",
        author: {
          name: "Stephen Miller",
          about:
            "Valetudo tonsor odit inflammatio. Statim aggredior vesper audacia them...",
        },
        rating: 3,
        price: 465,
        moreDetails: {
          publisher: "Yundt - O'Kon",
          firstPublished: Date.now(),
          seller: "Wisoky LLC",
          language: "telugu",
          description:
            "Tabgo denuncio uter tutis consequuntur. Carbo aliqua molestiae demitto...",
          fileSize: 3070,
          pages: 561,
          verified: true,
          edition: 4,
        },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("book created successfully");
  });
});

describe("GET /api/books/:id", () => {
  test("should return a book", async () => {
    const res = await request(server.getApp()).get(
      `/api/books/659181fde391be1c3f355454`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe("659181fde391be1c3f355454");
  });
});

describe("PATCH /api/books/:id", () => {
  test("should update a book", async () => {
    const res = await request(server.getApp())
      .patch("/api/books/659181fde391be1c3f355454")
      .send({
        title: "Test book updated",
        coverImage: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=58",
        category: "fiction",
        author: {
          name: "Stephen Miller",
          about:
            "Valetudo tonsor odit inflammatio. Statim aggredior vesper audacia them...",
        },
        rating: 3,
        price: 465,
        moreDetails: {
          publisher: "Yundt - O'Kon",
          firstPublished: Date.now(),
          seller: "Wisoky LLC",
          language: "telugu",
          description:
            "Tabgo denuncio uter tutis consequuntur. Carbo aliqua molestiae demitto...",
          fileSize: 3070,
          pages: 561,
          verified: true,
          edition: 4,
        },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("book updated successfully");
  });
});

describe("DELETE /api/books/:id", () => {
  test("should delete a product", async () => {
    const res = await request(server.getApp()).delete(
      "/api/books/6331abc9e9ececcc2d449e44"
    );
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("book deleted successfully");
  });
});

describe("GET /api/bulk-uploads-list", () => {
  test("should return all bulk uploads list", async () => {
    const res = await request(server.getApp()).get("/api/bulk-uploads-list");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /api/bulk-uploads-errors/:sessionId", () => {
  test("should return error detail related to each bulk upload", async () => {
    const res = await request(server.getApp()).get(
      `/api/bulk-uploads-errors/ce719e01-e53e-4ad2-8ca3-0dcb6b091c94`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });
});
