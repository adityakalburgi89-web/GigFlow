import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Leads Dashboard API',
      version: '1.0.0',
      description: 'API documentation for the Smart Leads Dashboard',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'sales_user'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Lead: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Lead ID' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            status: {
              type: 'string',
              enum: ['New', 'Contacted', 'Qualified', 'Lost'],
            },
            source: {
              type: 'string',
              enum: ['Website', 'Instagram', 'Referral'],
            },
            createdBy: { type: 'string', description: 'User ID' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            pages: { type: 'integer' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string' },
                  path: { type: 'string' },
                  value: { type: 'string' },
                  location: { type: 'string' },
                  type: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', format: 'password', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/AuthResponse' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation failed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationError' },
                },
              },
            },
            409: {
              description: 'Email already in use',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', format: 'password', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/AuthResponse' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation failed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationError' },
                },
              },
            },
            401: {
              description: 'Invalid email or password',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/leads': {
        get: {
          tags: ['Leads'],
          summary: 'List leads with pagination and filters',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10, maximum: 100 } },
            { in: 'query', name: 'sort', schema: { type: 'string', enum: ['latest', 'oldest'], default: 'latest' } },
            { in: 'query', name: 'status', schema: { type: 'string', enum: ['New', 'Contacted', 'Qualified', 'Lost'] } },
            { in: 'query', name: 'source', schema: { type: 'string', enum: ['Website', 'Instagram', 'Referral'] } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Paginated list of leads',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Lead' },
                      },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
          },
        },
        post: {
          tags: ['Leads'],
          summary: 'Create a new lead',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'source'],
                  properties: {
                    name: { type: 'string', example: 'Jane Smith' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    source: { type: 'string', enum: ['Website', 'Instagram', 'Referral'], example: 'Website' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Lead created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Lead' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation failed',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } },
            },
            401: {
              description: 'Unauthorized',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
          },
        },
      },
      '/leads/{id}': {
        put: {
          tags: ['Leads'],
          summary: 'Update a lead',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Lead ID' },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Jane Smith' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    status: { type: 'string', enum: ['New', 'Contacted', 'Qualified', 'Lost'], example: 'Contacted' },
                    source: { type: 'string', enum: ['Website', 'Instagram', 'Referral'], example: 'Referral' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Lead updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { $ref: '#/components/schemas/Lead' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation failed or invalid ID format',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            401: {
              description: 'Unauthorized',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            404: {
              description: 'Lead not found',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
          },
        },
        delete: {
          tags: ['Leads'],
          summary: 'Delete a lead (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Lead ID' },
          ],
          responses: {
            200: {
              description: 'Lead deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Lead deleted' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid lead ID format',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            401: {
              description: 'Unauthorized',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            403: {
              description: 'Forbidden - requires admin role',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            404: {
              description: 'Lead not found',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
          },
        },
      },
      '/leads/export': {
        get: {
          tags: ['Leads'],
          summary: 'Export leads as CSV (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'status', schema: { type: 'string', enum: ['New', 'Contacted', 'Qualified', 'Lost'] } },
            { in: 'query', name: 'source', schema: { type: 'string', enum: ['Website', 'Instagram', 'Referral'] } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'CSV file download',
              content: {
                'text/csv': {
                  schema: { type: 'string', format: 'binary' },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
            403: {
              description: 'Forbidden - requires admin role',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
