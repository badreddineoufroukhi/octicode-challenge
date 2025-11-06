import db from './database';
import { Patient, CreatePatient, UpdatePatient } from './schemas';

export class PatientService {
  // Get all patients
  static getAll(): Patient[] {
    const stmt = db.prepare('SELECT * FROM patients ORDER BY createdAt DESC');
    return stmt.all() as Patient[];
  }

  // Get patient by ID
  static getById(id: number): Patient | undefined {
    const stmt = db.prepare('SELECT * FROM patients WHERE id = ?');
    return stmt.get(id) as Patient | undefined;
  }

  // Create new patient
  static create(patient: CreatePatient): Patient {
    const stmt = db.prepare(`
      INSERT INTO patients (firstName, lastName, dateOfBirth, gender, email, phone, address)
      VALUES (@firstName, @lastName, @dateOfBirth, @gender, @email, @phone, @address)
    `);

    // Ensure all parameters are defined (use null for undefined optional fields)
    const params = {
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      email: patient.email ?? null,
      phone: patient.phone ?? null,
      address: patient.address ?? null,
    };

    const result = stmt.run(params);
    const newPatient = this.getById(result.lastInsertRowid as number);

    if (!newPatient) {
      throw new Error('Failed to create patient');
    }

    return newPatient;
  }

  // Update patient
  static update(id: number, updates: UpdatePatient): Patient | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const fields = Object.keys(updates)
      .filter((key) => updates[key as keyof UpdatePatient] !== undefined)
      .map((key) => `${key} = @${key}`)
      .join(', ');

    if (fields.length === 0) {
      return existing;
    }

    const stmt = db.prepare(`
      UPDATE patients
      SET ${fields}, updatedAt = datetime('now')
      WHERE id = @id
    `);

    stmt.run({ id, ...updates });
    return this.getById(id);
  }

  // Delete patient
  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM patients WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
