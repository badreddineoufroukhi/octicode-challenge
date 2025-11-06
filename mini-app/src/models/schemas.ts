import { z } from 'zod';

// Patient schemas
export const PatientSchema = z.object({
  id: z.number().int().positive().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  gender: z.enum(['male', 'female', 'other']),
  email: z.string().email('Invalid email address').optional(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .optional(),
  address: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreatePatientSchema = PatientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const UpdatePatientSchema = PatientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

// Note schemas
export const NoteSchema = z.object({
  id: z.number().int().positive().optional(),
  patientId: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z
    .enum(['consultation', 'diagnosis', 'treatment', 'general'])
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreateNoteSchema = NoteSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const UpdateNoteSchema = NoteSchema.omit({
  id: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

// Summary schemas
export const SummarySchema = z.object({
  id: z.number().int().positive().optional(),
  patientId: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreateSummarySchema = SummarySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const UpdateSummarySchema = SummarySchema.omit({
  id: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

// TypeScript types
export type Patient = z.infer<typeof PatientSchema>;
export type CreatePatient = z.infer<typeof CreatePatientSchema>;
export type UpdatePatient = z.infer<typeof UpdatePatientSchema>;

export type Note = z.infer<typeof NoteSchema>;
export type CreateNote = z.infer<typeof CreateNoteSchema>;
export type UpdateNote = z.infer<typeof UpdateNoteSchema>;

export type Summary = z.infer<typeof SummarySchema>;
export type CreateSummary = z.infer<typeof CreateSummarySchema>;
export type UpdateSummary = z.infer<typeof UpdateSummarySchema>;
