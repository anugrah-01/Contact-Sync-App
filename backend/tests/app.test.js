import request from "supertest";
import app from "../src/app.js";

describe("Health API", () => {

  test("GET / should return backend running message", async () => {

    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("ContactSync Backend Running");

  });

});