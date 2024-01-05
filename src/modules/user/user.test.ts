import request from "supertest";
import DBConnection from "../../lib/config/dbConnection";
import Server from "../../server";

const dbConnection = DBConnection.getInstance();
const server = Server.getInstance(dbConnection);

const mockUser = {
  firstName: "abc",
  lastName: "def",
  contact: {
    email: "abc@abc.com",
    phone: "9876543210",
  },
  password: "1234",
  confirmPassword: "123",
};

const updatedUser = {
  firstName: "qwe",
  lastName: "def",
  contact: {
    email: "qwe@qwe.com",
    phone: "9876543220",
  },
  password: "1234",
  confirmPassword: "123",
};

beforeEach(async () => {
  dbConnection.connectDB();
});

// afterEach(async () => {
//   dbConnection.closeDBConnection();
// });

let userId: string;

describe("POST /users", () => {
  test("should create a user", async () => {
    const res = await request(server.getApp()).post("/users").send(mockUser);
    // userId = res.body.user._id;
    console.log(res.body.user._id);
    userId = res.body.user._id;
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("user created successfully");
  });

  test("some error in creating the user", async () => {
    const res = await request(server.getApp()).post("/users");
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /users", () => {
  test("should return all users", async () => {
    const res = await request(server.getApp()).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("users fetched successfully");
  });

  test("some error in fetching user", async () => {
    dbConnection.closeDBConnection();
    const res = await request(server.getApp()).get("/users");
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /users/:id", () => {
  test("should return a single user", async () => {
    console.log("userId", userId);

    const res = await request(server.getApp()).get(`/users/${userId}`);
    expect(res.body.message).toBe("user fetched successfully");
  });

  test("some error in fetching the particular user", async () => {
    dbConnection.closeDBConnection();
    const res = await request(server.getApp()).get(`/users/${userId}`);
    expect(res.statusCode).toBe(404);
  });
});

// describe("PATCH /users/:id", () => {
//   test("should update a user", async () => {
//     const res = await request(server.getApp())
//       .patch(`/users/${userId}`)
//       .send(updatedUser);
//     expect(res.statusCode).toBe(201);
//     expect(res.body.message).toBe("user updated successfully");
//   });

//   test("some error in updating the user", async () => {
//     dbConnection.closeDBConnection();
//     const res = await request(server.getApp()).patch(`/users/${userId}`);
//     expect(res.statusCode).toBe(404);
//   });
// });

// describe("DELETE /users/:id", () => {
//   test("should delete a user", async () => {
//     const res = await request(server.getApp()).delete(`/users/${userId}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body.message).toBe("user deleted successfully");
//   });

//   test("some error in deleting the user", async () => {
//     dbConnection.closeDBConnection();
//     const res = await request(server.getApp()).get(`/users/${userId}`);
//     expect(res.statusCode).toBe(404);
//   });
// });

// describe("POST /users/login", () => {
//   test("should login a user", async () => {
//     const res = await request(server.getApp()).post("/users/login").send({
//       email: "abc@abc.com",
//       password: "1234",
//     });
//     expect(res.statusCode).toBe(200);
//     expect(res.body.message).toBe("user logged in successfully");
//   });

//   test("some error in fetching user", async () => {
//     const res = await request(server.getApp()).post("/users/login");
//     expect(res.statusCode).toBe(404);
//   });
// });
