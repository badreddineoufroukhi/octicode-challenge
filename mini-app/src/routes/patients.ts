import { Router, Request, Response } from 'express';
import { PatientService } from '../models/patientService';
import { CreatePatientSchema, UpdatePatientSchema } from '../models/schemas';
import { ZodError } from 'zod';

const router = Router();

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of all patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 *       500:
 *         description: Server error
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const patients = PatientService.getAll();
    res.json({ success: true, data: patients });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch patients' });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid patient ID' });
      return;
    }

    const patient = PatientService.getById(id);
    if (!patient) {
      res.status(404).json({ success: false, error: 'Patient not found' });
      return;
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch patient' });
  }
});

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - dob
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-15
 *               gender:
 *                 type: string
 *                 enum: [M, F, Other]
 *                 example: M
 *               contact:
 *                 type: string
 *                 example: john.doe@email.com
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Server error
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const validatedData = CreatePatientSchema.parse(req.body);
    const newPatient = PatientService.create(validatedData);
    res.status(201).json({ success: true, data: newPatient });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to create patient' });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [M, F, Other]
 *               contact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid patient ID' });
      return;
    }

    const validatedData = UpdatePatientSchema.parse(req.body);
    const updatedPatient = PatientService.update(id, validatedData);

    if (!updatedPatient) {
      res.status(404).json({ success: false, error: 'Patient not found' });
      return;
    }

    res.json({ success: true, data: updatedPatient });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
      return;
    }
    res.status(500).json({ success: false, error: 'Failed to update patient' });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid patient ID' });
      return;
    }

    const deleted = PatientService.delete(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Patient not found' });
      return;
    }

    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (_error) {
    console.error('Error deleting patient:', _error);
    res.status(500).json({ success: false, error: 'Failed to delete patient' });
  }
});

export default router;
