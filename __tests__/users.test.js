process.env.NODE_ENV = "test";
const db = require("../db");
const request = require("supertest");
const app = require("../");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let auth = {};

beforeAll(async () => {
  await db.query(
    "CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT, password TEXT)"
  );
});
// before each request, create a user and log them in
beforeEach(async () => {
  const hashedPassword = await bcrypt.hash("secret", 1);
  await db.query("INSERT INTO users (username, password) VALUES ('test', $1)", [
    hashedPassword
  ]);
  const response = await request(app)
    .post("/users/auth")
    .send({
      username: "test",
      password: "secret"
    });
  auth.token = response.body.token;
  auth.current_user_id = jsonwebtoken.decode(auth.token).user_id;
});

// remove them
afterEach(async () => {
  await db.query("DELETE FROM users");
});

afterAll(async () => {
  await db.query("DROP TABLE users");
  db.end();
});

describe("GET /users", () => {
  test("returns a list of users", async () => {
    const response = await request(app)
      .get(`/users`)
      .set("authorization", auth.token);
    expect(response.body.length).toBe(1);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /users without auth", () => {
  test("requires login", async () => {
    const response = await request(app).get(`/users/`);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});

describe("GET /secure/:id", () => {
  test("authorizes only correct users", async () => {
    const response = await request(app)
      .get(`/users/secure/100`)
      .set("authorization", auth.token);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});

describe("GET /secure/:id", () => {
  test("authorizes only correct users", async () => {
    const response = await request(app)
      .get(`/users/secure/${auth.current_user_id}`)
      .set("authorization", auth.token);
    expect(response.body.message).toBe("You made it!");
  });
});
