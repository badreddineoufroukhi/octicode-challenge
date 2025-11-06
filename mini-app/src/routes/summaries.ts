import { Router, Request, Response } from 'express';
import { SummaryService } from '../models/summaryService';
import { CreateSummarySchema, UpdateSummarySchema } from '../models/schemas';
import { ZodError } from 'zod';

const router = Router();

/**
 * @swagger
 * /api/summaries:
 *   get:
 *     summary: Get all summaries
 *     tags: [Summaries]
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: integer
 *         description: Optional patient ID to filter summaries
 *     responses:
 *       200:
 *         description: List of summaries
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

    const summaries = SummaryService.getAll(patientId);
    res.json({ success: true, data: summaries });
  } catch (error) {
    console.error('Error fetching summaries:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch summaries' });
  }
});

/**
 * @swagger
 * /api/summaries/{id}:
 *   get:
 *     summary: Get summary by ID
 *     tags: [Summaries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Summary details
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid summary ID' });
      return;
    }

    const summary = SummaryService.getById(id);
    if (!summary) {
      res.status(404).json({ success: false, error: 'Summary not found' });
      return;
    }

    res.json({ success: true, data: summary });
  } catch (_error) {
    console.error('Error fetching summary:', _error);
    res.status(500).json({ success: false, error: 'Failed to fetch summary' });
  }
});

/**
 * @swagger
 * /api/summaries:
 *   post:
 *     summary: Create new summary
 *     tags: [Summaries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Summary'
 *     responses:
 *       201:
 *         description: Summary created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const validatedData = CreateSummarySchema.parse(req.body);
    const newSummary = SummaryService.create(validatedData);
    res.status(201).json({ success: true, data: newSummary });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to create summary' });
  }
});

/**
 * @swagger
 * /api/summaries/{id}:
 *   put:
 *     summary: Update summary
 *     tags: [Summaries]
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
 *             $ref: '#/components/schemas/Summary'
 *     responses:
 *       200:
 *         description: Summary updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid summary ID' });
      return;
    }

    const validatedData = UpdateSummarySchema.parse(req.body);
    const updatedSummary = SummaryService.update(id, validatedData);

    if (!updatedSummary) {
      res.status(404).json({ success: false, error: 'Summary not found' });
      return;
    }

    res.json({ success: true, data: updatedSummary });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to update summary' });
  }
});

/**
 * @swagger
 * /api/summaries/{id}:
 *   delete:
 *     summary: Delete summary
 *     tags: [Summaries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Summary deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid summary ID' });
      return;
    }

    const deleted = SummaryService.delete(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Summary not found' });
      return;
    }

    res.json({ success: true, message: 'Summary deleted successfully' });
  } catch (_error) {
    console.error('Error deleting summary:', _error);
    res.status(500).json({ success: false, error: 'Failed to delete summary' });
  }
});

export default router;
