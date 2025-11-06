import { Router, Request, Response } from 'express';
import { NoteService } from '../models/noteService';
import { CreateNoteSchema, UpdateNoteSchema } from '../models/schemas';
import { ZodError } from 'zod';

const router = Router();

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: integer
 *         description: Optional patient ID to filter notes
 *     responses:
 *       200:
 *         description: List of notes
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const patientId = req.query.patientId
      ? parseInt(req.query.patientId as string)
      : undefined;

    if (patientId !== undefined && isNaN(patientId)) {
      res.status(400).json({ success: false, error: 'Invalid patient ID' });
      return;
    }

    const notes = NoteService.getAll(patientId);
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notes' });
  }
});

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note details
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid note ID' });
      return;
    }

    const note = NoteService.getById(id);
    if (!note) {
      res.status(404).json({ success: false, error: 'Note not found' });
      return;
    }

    res.json({ success: true, data: note });
  } catch (error) {
    console.error('Error fetching note by ID:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch note' });
  }
});

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const validatedData = CreateNoteSchema.parse(req.body);
    const newNote = NoteService.create(validatedData);
    res.status(201).json({ success: true, data: newNote });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to create note' });
  }
});

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid note ID' });
      return;
    }

    const validatedData = UpdateNoteSchema.parse(req.body);
    const updatedNote = NoteService.update(id, validatedData);

    if (!updatedNote) {
      res.status(404).json({ success: false, error: 'Note not found' });
      return;
    }

    res.json({ success: true, data: updatedNote });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to update note' });
  }
});

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid note ID' });
      return;
    }

    const deleted = NoteService.delete(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Note not found' });
      return;
    }

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (_error) {
    console.error('Error deleting note:', _error);
    res.status(500).json({ success: false, error: 'Failed to delete note' });
  }
});

export default router;
