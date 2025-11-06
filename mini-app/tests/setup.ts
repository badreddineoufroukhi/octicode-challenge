import { beforeAll } from 'vitest';
import db from '../src/models/database';

beforeAll(() => {
  // Clean up database before all tests
  try {
    db.exec('DELETE FROM summaries');
    db.exec('DELETE FROM notes');
    db.exec('DELETE FROM patients');
    console.log('Test setup complete - database cleaned');
  } catch (error) {
    console.error('Error cleaning up database:', error);
  }
});
