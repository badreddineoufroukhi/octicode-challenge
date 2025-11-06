import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { initDatabase } from '../src/models/database';
import { PatientService } from '../src/models/patientService';
import { NoteService } from '../src/models/noteService';

const app = createApp();
const API_KEY = 'test-api-key';

beforeAll(() => {
  // Initialize database before tests
  initDatabase();
});

describe('Note API', () => {
  let patientId: number;

  beforeEach(async () => {
    // Create a patient before each test
    const patient = PatientService.create({
      firstName: 'Alice',
      lastName: 'Johnson',
      dateOfBirth: '1992-03-10',
      gender: 'female',
    });
    patientId = patient.id!;
  });

  it('should create a note for the patient', async () => {
    const newNote = {
      patientId: patientId,
      title: 'Initial Consultation',
      content: 'Patient reports mild headaches and fatigue.',
      category: 'consultation',
    };

    const response = await request(app)
      .post('/api/notes')
      .set('X-API-Key', API_KEY)
      .send(newNote)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.title).toBe(newNote.title);
    expect(response.body.data.content).toBe(newNote.content);
  });

  it('should retrieve the note by ID', async () => {
    // First create a note
    const note = NoteService.create({
      patientId: patientId,
      title: 'Test Note',
      content: 'Test content',
      category: 'general',
    });

    const response = await request(app)
      .get(`/api/notes/${note.id}`)
      .set('X-API-Key', API_KEY)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(note.id);
    expect(response.body.data.title).toBe('Test Note');
    expect(response.body.data.content).toBe('Test content');
    expect(response.body.data.patientId).toBe(patientId);
  });

  it('should retrieve all notes for a patient', async () => {
    // Create a note first
    NoteService.create({
      patientId: patientId,
      title: 'Note 1',
      content: 'Content 1',
    });

    const response = await request(app)
      .get(`/api/notes?patientId=${patientId}`)
      .set('X-API-Key', API_KEY)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].patientId).toBe(patientId);
  });

  it('should return 404 for non-existent note', async () => {
    const response = await request(app)
      .get('/api/notes/99999')
      .set('X-API-Key', API_KEY)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Note not found');
  });
});
