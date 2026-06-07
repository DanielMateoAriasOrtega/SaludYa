const request = require("supertest");
const app = require("../index");

describe("API Pacientes", () => {

  test("GET /pacientes", async () => {
    const response = await request(app).get("/pacientes");

    expect(response.statusCode).toBe(200);
  });

  test("POST /pacientes sin datos obligatorios", async () => {
    const response = await request(app)
      .post("/pacientes")
      .send({});

    expect(response.statusCode).toBe(400);
  });

  test("GET paciente inexistente", async () => {
    const response = await request(app)
      .get("/pacientes/999999");

    expect([404,500,200]).toContain(response.statusCode);
  });

});