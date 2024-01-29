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
  confirmPassword: "1234",
};

const updatedUser = {
  firstName: "qwe",
  lastName: "def",
  contact: {
    email: "qwe@abc.com",
    phone: "9876543220",
  },
  password: "1234",
  confirmPassword: "1234",
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

let userId: string;

describe("POST /users", () => {
  test("should create a user", async () => {
    const res = await request(server.getApp()).post("/users").send(mockUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("user created successfully");
  });

  test("some error in creating the user", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).post("/users");
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /users", () => {
  test("should return all users", async () => {
    let res = await request(server.getApp()).post("/users").send(mockUser);
    res = await request(server.getApp()).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("users fetched successfully");
  });

  test("some error in fetching user", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).get("/users");
    expect(res.statusCode).toBe(404);
  });
});

describe("GET /users/:id", () => {
  test("should return a single user", async () => {
    let res = await request(server.getApp()).post("/users").send(mockUser);
    userId = res.body.user._id;
    console.log("Fetching user with ID:", userId);

    res = await request(server.getApp()).get(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("user fetched successfully");
  });

  test("some error in fetching the particular user", async () => {
    const res = await request(server.getApp()).get(`/users/nonexistentUserId`);
    expect(res.statusCode).toBe(404);
  });
});

describe("PATCH /users/:id", () => {
  test("should update a user", async () => {
    let res = await request(server.getApp()).post("/users").send(mockUser);
    userId = res.body.user._id;
    res = await request(server.getApp())
      .patch(`/users/${userId}`)
      .send(updatedUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("user updated successfully");
  });

  test("some error in updating the user", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).patch(`/users/${userId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /users/:id", () => {
  test("should delete a user", async () => {
    let res = await request(server.getApp()).post("/users").send(mockUser);
    userId = res.body.user._id;
    res = await request(server.getApp()).delete(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("user deleted successfully");
  });

  test("some error in deleting the user", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).delete(`/users/${userId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /users/login", () => {
  test("when user details are correct", async () => {
    let res = await request(server.getApp()).post("/users").send(mockUser);
    const email = res.body.user.contact.email;
    const password = res.body.user.password;
    console.log("email", email);
    console.log("password", password);
    
    res = await request(server.getApp()).post("/users/login").send({
      email : email,
      password : password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("logged in successfully");
  });

  test("when user email is not found", async () => {
    const res = await request(server.getApp()).post("/users/login").send({
      email : "notfound@notfound.com",
      password : "1234"
    });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("invalid email");
  });

  test("when user email is corect but not the password", async () => {
    let res = await request(server.getApp()).post("/users").send(mockUser);
    const email = res.body.user.contact.email;
    res = await request(server.getApp()).post("/users/login").send({
      email : email,
      password : "987"
    });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("invalid password" );
  });

  test("any error case", async () => {
    await dbConnection.closeDBConnection();
    const res = await request(server.getApp()).post("/users/login").send({
      email : "abc@abc.com",
      password : "123"
    });
    expect(res.statusCode).toBe(404);
  });
});
