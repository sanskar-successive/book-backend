import request from "supertest";
import DBConnection from "../../lib/config/dbConnection";
import Server from "../../server";

const dbConnection = DBConnection.getInstance();
const server = Server.getInstance(dbConnection);

let bookId: string;
const mockBook = {
  title: "The Great Gatsby",
  coverImage: "gatsby.jpg",
  category: "fiction",
  author: {
    name: "F. Scott Fitzgerald",
    about:
      "American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century.",
  },
  rating: 4.5,
  price: 19.99,
  moreDetails: {
    publisher: "Scribner",
    firstPublished: new Date("1925-04-10"),
    seller: "Amazon",
    language: "english",
    description:
      "The Great Gatsby is a novel by F. Scott Fitzgerald that follows a cast of characters living in the fictional towns of West Egg and East Egg on prosperous Long Island in the summer of 1922.",
    fileSize: 1024,
    pages: 180,
    verified: true,
    edition: 1,
  },
};

const updatedBook = {
  title: "The Great Gatsby updated",
  coverImage: "gatsby.jpg",
  category: "romance",
  author: {
    name: "F. Scott Fitzgerald",
    about:
      "American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century.",
  },
  rating: 4.5,
  price: 19.99,
  moreDetails: {
    publisher: "Scribner",
    firstPublished: new Date("1925-04-08"),
    seller: "Amazon",
    language: "english",
    description:
      "The Great Gatsby is a novel by F. Scott Fitzgerald that follows a cast of characters living in the fictional towns of West Egg and East Egg on prosperous Long Island in the summer of 1922.",
    fileSize: 1024,
    pages: 180,
    verified: true,
    edition: 1,
  },
};

beforeAll(async () => {
  await dbConnection.connectDB();
});

beforeEach(async () => {
  await dbConnection.connectDB();
});

afterEach(async () => {
  await dbConnection.closeDBConnection();
});

afterAll(async () => {
  await dbConnection.closeDBConnection();
});

describe("POST /api/books", () => {
  test("should create a book", async () => {
    const res = await request(server.getApp())
      .post("/api/books")
      .send(mockBook);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("book created successfully");
  });

  test("some error in creating the book", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).post("/api/books");
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /api/books", () => {
  test("should return all books", async () => {
    let res = await request(server.getApp()).post("/api/books").send(mockBook);
    res = await request(server.getApp()).get("/api/books");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("books fetched successfully");
  });

  test("some error in fetching books", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).get("/api/books");
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /api/search", () => {
  test("should return books after related to search and filter queries", async () => {
    let res = await request(server.getApp()).post("/api/books").send(mockBook);
    res = await request(server.getApp()).get("/api/search").query({
      search: "great",
      category: ["fiction", "romance"],
      language: ["english","hindi"],
      "price.from": 50,
      "price.to": 2000,
      rating: "aboveThree",
      sortBy: "popularity",
      skip: 0,
      limit: 10,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("books fetched successfully");
  });

  test("should return books after related to search and filter queries", async () => {
    let res = await request(server.getApp()).post("/api/books").send(mockBook);
    res = await request(server.getApp()).get("/api/search").query({
      search: "great",
      "price.from": 50,
      "price.to": 2000,
      rating: "aboveFour",
      sortBy: "price low to high",
      skip: 0,
      limit: 10,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("books fetched successfully");
  });

  test("should return books after related to search and filter queries", async () => {
    let res = await request(server.getApp()).post("/api/books").send(mockBook);
    res = await request(server.getApp()).get("/api/search").query({
      search: "great",
      "price.from": 50,
      "price.to": 2000,
      rating: "aboveFour",
      sortBy: "price high to low",
      skip: 0,
      limit: 10,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("books fetched successfully");
  });

  test("should return books after related to search and filter queries", async () => {
    let res = await request(server.getApp()).post("/api/books").send(mockBook);
    res = await request(server.getApp()).get("/api/search").query({
      search: "great",
      "price.from": 50,
      "price.to": 2000,
      rating: "aboveFour",
      sortBy: "title",
      skip: 0,
      limit: 10,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("books fetched successfully");
  });

  test("should return books after related to search and filter queries", async () => {
    let res = await request(server.getApp()).post("/api/books").send(mockBook);
    res = await request(server.getApp()).get("/api/search").query({
      search: "great",
      "price.from": 50,
      "price.to": 2000,
      rating: "aboveFour",
      skip: 0,
      limit: 10,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("books fetched successfully");
  });

  test("some error in fetching books", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).get("/api/search").query({
      category: "notfound",
      language: "korean",
      sortBy: "notallowed",
    })
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /api/books/:id", () => {
  test("should return a single book", async () => {
    let res = await request(server.getApp()).post("/api/books").send(mockBook);
    bookId = res.body.book._id;
    console.log("Fetching book with ID:", bookId);

    res = await request(server.getApp()).get(`/api/books/${bookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("book fetched successfully");
  });

  test("some error in fetching the particular book", async () => {
    const res = await request(server.getApp()).get(
      `/api/books/nonexistentbookId`
    );
    expect(res.statusCode).toBe(404);
  });
});

describe("PATCH /api/books/:id", () => {
  test("should update a book", async () => {
    let res = await request(server.getApp()).post("/api/books").send(mockBook);
    bookId = res.body.book._id;
    res = await request(server.getApp())
      .patch(`/api/books/${bookId}`)
      .send(updatedBook);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("book updated successfully");
  });

  test("some error in updating the book", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).patch(`/api/books/${bookId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /api/books/:id", () => {
  test("should delete a book", async () => {
    let res = await request(server.getApp()).post("/api/books").send(mockBook);
    bookId = res.body.book._id;
    res = await request(server.getApp()).delete(`/api/books/${bookId}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("book deleted successfully");
  });

  test("some error in deleting the book", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).delete(`/api/books/${bookId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /api/books/", () => {
  test("should delete a book", async () => {
    let res = await request(server.getApp()).post("/api/books").send(mockBook);
    res = await request(server.getApp()).delete(`/api/books`);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("all books deleted successfully");
  });

  test("some error in deleting the book", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).delete(`/api/books`);
    expect(res.statusCode).toBe(404);
  });
});

const mockBulkUpload = {
  recordsProcessed: 1000000,
  totalErrors: 3456,
  timeTaken: 300,
  session_id: "29d68c56-e85b-4068-9005-5168f834f798",
};

describe("GET /api/bulk-uploads-list", () => {
  test("should return all bulk uploads", async () => {
    let res = await request(server.getApp())
      .post("/api/bulk-uploads-list")
      .send(mockBulkUpload);
    res = await request(server.getApp()).get("/api/bulk-uploads-list");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("fetching all bulk uploads data");
  });

  test("some error in fetching bulk uploads data", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).get("/api/bulk-uploads-list");
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /api/bulk-uploads-errors/:sessionId", () => {
  test("should return all bulk error details", async () => {
    let res = await request(server.getApp())
      .post("/bulk-uploads-errors/:sessionId")
      .send(mockBulkUpload);
    res = await request(server.getApp()).get(
      "/api/bulk-uploads-errors/:sessionId"
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("fetching all bulk uploads error details");
  });

  test("some error in fetching bulk error details", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).get(
      "/bulk-uploads-errors/:sessionId"
    );
    expect(res.statusCode).toBe(404);
  });
});


describe("POST /api/bulk-upload", () => {
  test("should create a book", async () => {
    const res = await request(server.getApp())
      .post("/api/bulk-upload")
      .send(mockBook);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("processing started");
  });

  test("some error in creating the book", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).post("/api/books");
    expect(res.statusCode).toBe(404);
  });
});