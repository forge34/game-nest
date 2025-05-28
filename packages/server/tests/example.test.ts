import { createServer } from "http";
import { app } from "../src/app.ts";
import request from "supertest";

const server = createServer(app);

const port = 3001;

server.listen(port, () => {});

test("index route works", async () => {
  const response = await request(app)
    .get("/")
    .set("Accept", "application/json");
  expect(response.status).toEqual(200);
});
