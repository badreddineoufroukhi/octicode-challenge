import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { initDatabase } from '../src/models/database';

const app = createApp();
const API_KEY = 'test-api-key';

beforeAll(() => {
  // Initialize database before tests
  initDatabase();
});

describe('Patient API', () => {
  it('should create a new patient', async () => {
    const newPatient = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      gender: 'male',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main Street',
    };

    const response = await request(app)
      .post('/api/patients')
      .set('X-API-Key', API_KEY)
      .send(newPatient)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.firstName).toBe(newPatient.firstName);
    expect(response.body.data.lastName).toBe(newPatient.lastName);
    expect(response.body.data.email).toBe(newPatient.email);
    expect(response.body.data.createdAt).toBeDefined();
  });

  it('should fail to create patient with invalid data', async () => {
    const invalidPatient = {
      firstName: 'Jane',
      // Missing required fields
    };

    const response = await request(app)
      .post('/api/patients')
      .set('X-API-Key', API_KEY)
      .send(invalidPatient)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Validation error');
    expect(response.body.details).toBeDefined();
  });

  it('should fail to create patient with invalid email', async () => {
    const invalidPatient = {
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1985-06-20',
      gender: 'female',
      email: 'not-an-email',
    };

    const response = await request(app)
      .post('/api/patients')
      .set('X-API-Key', API_KEY)
      .send(invalidPatient)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Validation error');
  });
});
