import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medical Records API - Octicode Challenge 3',
      version: '1.0.0',
      description:
        'API pour la gestion des dossiers médicaux, incluant les patients, notes et résumés',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for rate limiting',
        },
      },
      schemas: {
        Patient: {
          type: 'object',
          required: ['name', 'dob', 'gender'],
          properties: {
            id: {
              type: 'integer',
              description: 'Patient ID (auto-generated)',
            },
            name: {
              type: 'string',
              description: 'Patient full name',
              example: 'John Doe',
            },
            dob: {
              type: 'string',
              format: 'date',
              description: 'Date of birth (YYYY-MM-DD)',
              example: '1990-01-15',
            },
            gender: {
              type: 'string',
              enum: ['M', 'F', 'Other'],
              description: 'Patient gender',
              example: 'M',
            },
            contact: {
              type: 'string',
              description: 'Contact information',
              example: 'john.doe@email.com',
            },
          },
        },
        Note: {
          type: 'object',
          required: ['patientId', 'content', 'date'],
          properties: {
            id: {
              type: 'integer',
              description: 'Note ID (auto-generated)',
            },
            patientId: {
              type: 'integer',
              description: 'Associated patient ID',
            },
            content: {
              type: 'string',
              description: 'Note content',
              example: 'Patient consulted for annual checkup',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Note date (YYYY-MM-DD)',
              example: '2025-01-15',
            },
            author: {
              type: 'string',
              description: 'Note author',
              example: 'Dr. Smith',
            },
          },
        },
        Summary: {
          type: 'object',
          required: ['patientId', 'content', 'date'],
          properties: {
            id: {
              type: 'integer',
              description: 'Summary ID (auto-generated)',
            },
            patientId: {
              type: 'integer',
              description: 'Associated patient ID',
            },
            content: {
              type: 'string',
              description: 'Summary content',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Summary date (YYYY-MM-DD)',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        Health: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            uptime: {
              type: 'number',
              description: 'Server uptime in seconds',
            },
            environment: {
              type: 'string',
              example: 'development',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'API key missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        RateLimitError: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
