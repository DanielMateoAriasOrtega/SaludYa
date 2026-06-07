const request = require('supertest');

// Mock the DB module before importing the app
jest.mock('../db', () => ({
  query: jest.fn(),
}));

const db = require('../db');
const app = require('../index');

describe('Rutas pacientes - unit', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  test('GET /pacientes success', async () => {
    const results = [{ id: 1, nombre: 'Ana' }];
    db.query.mockImplementation((...args) => {
      const cb = args[args.length - 1];
      cb(null, results);
    });

    const res = await request(app).get('/pacientes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(results);
  });

  test('GET /pacientes error', async () => {
    db.query.mockImplementation((...args) => {
      const cb = args[args.length - 1];
      cb(new Error('db error'));
    });

    const res = await request(app).get('/pacientes');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /pacientes/:id not found', async () => {
    db.query.mockImplementation((...args) => {
      const cb = args[args.length - 1];
      cb(null, []);
    });

    const res = await request(app).get('/pacientes/123');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /pacientes/:id success', async () => {
    const result = [{ id: 2, nombre: 'Luis' }];
    db.query.mockImplementation((...args) => {
      const cb = args[args.length - 1];
      cb(null, result);
    });

    const res = await request(app).get('/pacientes/2');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(result[0]);
  });

  test('POST /pacientes success', async () => {
    db.query.mockImplementation((...args) => {
      const cb = args[args.length - 1];
      cb(null, { insertId: 42 });
    });

    const payload = {
      nombre: 'Pedro',
      correo: 'p@e.com',
      telefono: '123',
      identificacion: 'ABC',
    };

    const res = await request(app).post('/pacientes').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 42);
    expect(res.body).toMatchObject(payload);
  });

  test('POST /pacientes db error', async () => {
    db.query.mockImplementation((...args) => {
      const cb = args[args.length - 1];
      cb(new Error('insert error'));
    });

    const payload = {
      nombre: 'Pedro',
      correo: 'p@e.com',
      telefono: '123',
      identificacion: 'ABC',
    };

    const res = await request(app).post('/pacientes').send(payload);
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /pacientes/:id success', async () => {
    db.query.mockImplementation((...args) => {
      const cb = args[args.length - 1];
      cb(null);
    });

    const res = await request(app)
      .put('/pacientes/5')
      .send({ nombre: 'X', correo: 'x@x.com', telefono: '1', identificacion: '1' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('PUT /pacientes/:id db error', async () => {
    db.query.mockImplementation((...args) => {
      const cb = args[args.length - 1];
      cb(new Error('update error'));
    });

    const res = await request(app)
      .put('/pacientes/5')
      .send({ nombre: 'X', correo: 'x@x.com', telefono: '1', identificacion: '1' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  test('DELETE /pacientes/:id success', async () => {
    db.query.mockImplementation((...args) => {
      const cb = args[args.length - 1];
      cb(null);
    });

    const res = await request(app).delete('/pacientes/9');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('DELETE /pacientes/:id db error', async () => {
    db.query.mockImplementation((...args) => {
      const cb = args[args.length - 1];
      cb(new Error('delete error'));
    });

    const res = await request(app).delete('/pacientes/9');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
