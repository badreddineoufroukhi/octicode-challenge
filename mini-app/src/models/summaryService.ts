import db from './database';
import { Summary, CreateSummary, UpdateSummary } from './schemas';

export class SummaryService {
  // Get all summaries (optionally filter by patientId)
  static getAll(patientId?: number): Summary[] {
    if (patientId) {
      const stmt = db.prepare(
        'SELECT * FROM summaries WHERE patientId = ? ORDER BY createdAt DESC'
      );
      return stmt.all(patientId) as Summary[];
    }
    const stmt = db.prepare('SELECT * FROM summaries ORDER BY createdAt DESC');
    return stmt.all() as Summary[];
  }

  // Get summary by ID
  static getById(id: number): Summary | undefined {
    const stmt = db.prepare('SELECT * FROM summaries WHERE id = ?');
    return stmt.get(id) as Summary | undefined;
  }

  // Create new summary
  static create(summary: CreateSummary): Summary {
    const stmt = db.prepare(`
      INSERT INTO summaries (patientId, title, content, dateFrom, dateTo)
      VALUES (@patientId, @title, @content, @dateFrom, @dateTo)
    `);

    // Ensure all parameters are defined (use null for undefined optional fields)
    const params = {
      patientId: summary.patientId,
      title: summary.title,
      content: summary.content,
      dateFrom: summary.dateFrom ?? null,
      dateTo: summary.dateTo ?? null,
    };

    const result = stmt.run(params);
    const newSummary = this.getById(result.lastInsertRowid as number);

    if (!newSummary) {
      throw new Error('Failed to create summary');
    }

    return newSummary;
  }

  // Update summary
  static update(id: number, updates: UpdateSummary): Summary | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const fields = Object.keys(updates)
      .filter((key) => updates[key as keyof UpdateSummary] !== undefined)
      .map((key) => `${key} = @${key}`)
      .join(', ');

    if (fields.length === 0) {
      return existing;
    }

    const stmt = db.prepare(`
      UPDATE summaries
      SET ${fields}, updatedAt = datetime('now')
      WHERE id = @id
    `);

    stmt.run({ id, ...updates });
    return this.getById(id);
  }

  // Delete summary
  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM summaries WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
