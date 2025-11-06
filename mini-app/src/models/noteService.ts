import db from './database';
import { Note, CreateNote, UpdateNote } from './schemas';

export class NoteService {
  // Get all notes (optionally filter by patientId)
  static getAll(patientId?: number): Note[] {
    if (patientId) {
      const stmt = db.prepare(
        'SELECT * FROM notes WHERE patientId = ? ORDER BY createdAt DESC'
      );
      return stmt.all(patientId) as Note[];
    }
    const stmt = db.prepare('SELECT * FROM notes ORDER BY createdAt DESC');
    return stmt.all() as Note[];
  }

  // Get note by ID
  static getById(id: number): Note | undefined {
    const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
    return stmt.get(id) as Note | undefined;
  }

  // Create new note
  static create(note: CreateNote): Note {
    const stmt = db.prepare(`
      INSERT INTO notes (patientId, title, content, category)
      VALUES (@patientId, @title, @content, @category)
    `);

    // Ensure all parameters are defined (use null for undefined optional fields)
    const params = {
      patientId: note.patientId,
      title: note.title,
      content: note.content,
      category: note.category ?? null,
    };

    const result = stmt.run(params);
    const newNote = this.getById(result.lastInsertRowid as number);

    if (!newNote) {
      throw new Error('Failed to create note');
    }

    return newNote;
  }

  // Update note
  static update(id: number, updates: UpdateNote): Note | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const fields = Object.keys(updates)
      .filter((key) => updates[key as keyof UpdateNote] !== undefined)
      .map((key) => `${key} = @${key}`)
      .join(', ');

    if (fields.length === 0) {
      return existing;
    }

    const stmt = db.prepare(`
      UPDATE notes
      SET ${fields}, updatedAt = datetime('now')
      WHERE id = @id
    `);

    stmt.run({ id, ...updates });
    return this.getById(id);
  }

  // Delete note
  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
