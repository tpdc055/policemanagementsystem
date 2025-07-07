import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PNG Cyber Crime Monitoring System API',
      version: '1.0.0',
      description: `
        Comprehensive API for Papua New Guinea's Cyber Crime Monitoring and Investigation System.

        This system provides secure endpoints for:
        - Case Management and Investigation Tracking
        - Evidence Storage and Chain of Custody
        - Advanced Search and Analytics
        - Cloud Storage Integration (AWS S3)
        - Real-time Notifications and Monitoring
        - Legal Request Management
        - Knowledge Base and Training Resources

        ## Authentication

        All API endpoints require authentication using JWT tokens obtained through the login endpoint.
        Include the token in the Authorization header: \`Bearer <token>\`

        ## Rate Limiting

        API requests are rate-limited to prevent abuse:
        - 1000 requests per hour for authenticated users
        - 100 requests per hour for unauthenticated endpoints

        ## Error Handling

        All errors follow RFC 7807 Problem Details format:
        \`\`\`json
        {
          "error": "Error message",
          "status": 400,
          "details": "Additional error details"
        }
        \`\`\`

        ## Data Security

        - All evidence files are encrypted at rest (AES-256)
        - API communications use HTTPS/TLS 1.3
        - Audit logs track all system access
        - Role-based access control (RBAC) enforced
      `,
      contact: {
        name: 'PNG Cyber Crime Unit',
        email: 'cybercrime@police.gov.pg',
        url: 'https://police.gov.pg/cyber-crime',
      },
      license: {
        name: 'Government Use Only',
        url: 'https://police.gov.pg/terms',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://cyber-crime-monitoring.police.gov.pg'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production'
          ? 'Production Server'
          : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/auth/signin endpoint',
        },
      },
      schemas: {
        // User Management
        User: {
          type: 'object',
          required: ['id', 'email', 'name', 'role', 'department'],
          properties: {
            id: { type: 'string', format: 'cuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: {
              type: 'string',
              enum: ['ADMIN', 'UNIT_COMMANDER', 'SENIOR_INVESTIGATOR', 'INVESTIGATOR', 'ANALYST', 'OFFICER']
            },
            department: { type: 'string' },
            phoneNumber: { type: 'string', nullable: true },
            isActive: { type: 'boolean' },
            lastLogin: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // Case Management
        CyberCase: {
          type: 'object',
          required: ['id', 'caseId', 'title', 'description', 'offenseType', 'priority', 'status'],
          properties: {
            id: { type: 'string', format: 'cuid' },
            caseId: { type: 'string', example: 'CYBER-2024-001' },
            title: { type: 'string' },
            description: { type: 'string' },
            offenseType: { type: 'string' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
            status: {
              type: 'string',
              enum: ['OPEN', 'IN_PROGRESS', 'UNDER_INVESTIGATION', 'PENDING_LEGAL', 'SUSPENDED', 'CLOSED', 'ARCHIVED']
            },
            incidentDate: { type: 'string', format: 'date-time' },
            reportedDate: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            estimatedLoss: { type: 'number', format: 'decimal', nullable: true },
            currency: { type: 'string', default: 'PGK' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // Evidence Management
        Evidence: {
          type: 'object',
          required: ['id', 'caseId', 'title', 'description', 'evidenceType'],
          properties: {
            id: { type: 'string', format: 'cuid' },
            caseId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            evidenceType: {
              type: 'string',
              enum: ['DIGITAL', 'PHYSICAL', 'FINANCIAL', 'TESTIMONIAL', 'FORENSIC']
            },
            filename: { type: 'string' },
            fileSize: { type: 'integer' },
            mimeType: { type: 'string' },
            hash: { type: 'string', description: 'SHA-256 hash for integrity verification' },
            source: { type: 'string' },
            collectedAt: { type: 'string', format: 'date-time' },
            chainOfCustody: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  action: { type: 'string' },
                  userId: { type: 'string' },
                  timestamp: { type: 'string', format: 'date-time' },
                  location: { type: 'string' },
                },
              },
            },
            isSecure: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // Search
        SearchRequest: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query text' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            caseTypes: { type: 'array', items: { type: 'string' } },
            priorities: { type: 'array', items: { type: 'string' } },
            statuses: { type: 'array', items: { type: 'string' } },
            location: { type: 'string' },
            page: { type: 'integer', minimum: 1, default: 1 },
            pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
        },

        SearchResult: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string', enum: ['case', 'evidence', 'suspect', 'victim', 'knowledge'] },
            title: { type: 'string' },
            description: { type: 'string' },
            relevanceScore: { type: 'number' },
            highlights: { type: 'array', items: { type: 'string' } },
            metadata: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        SearchResponse: {
          type: 'object',
          properties: {
            results: { type: 'array', items: { $ref: '#/components/schemas/SearchResult' } },
            totalCount: { type: 'integer' },
            facets: {
              type: 'object',
              properties: {
                types: { type: 'object', additionalProperties: { type: 'integer' } },
                priorities: { type: 'object', additionalProperties: { type: 'integer' } },
                statuses: { type: 'object', additionalProperties: { type: 'integer' } },
                departments: { type: 'object', additionalProperties: { type: 'integer' } },
              },
            },
            searchTime: { type: 'integer', description: 'Search execution time in milliseconds' },
            page: { type: 'integer' },
            pageSize: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },

        // Cloud Storage
        S3UploadResult: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'S3 object key' },
            bucket: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            etag: { type: 'string' },
            size: { type: 'integer' },
            uploadedAt: { type: 'string', format: 'date-time' },
          },
        },

        StorageMetrics: {
          type: 'object',
          properties: {
            totalFiles: { type: 'integer' },
            totalSize: { type: 'integer', description: 'Total storage in bytes' },
            sizeByType: { type: 'object', additionalProperties: { type: 'integer' } },
            costs: {
              type: 'object',
              properties: {
                estimated: {
                  type: 'object',
                  properties: {
                    storage: { type: 'number' },
                    requests: { type: 'number' },
                    dataTransfer: { type: 'number' },
                  },
                },
                currency: { type: 'string' },
                period: { type: 'string' },
              },
            },
          },
        },

        // Notifications
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: {
              type: 'string',
              enum: ['CASE_ASSIGNED', 'CASE_UPDATE', 'EVIDENCE_UPLOADED', 'LEGAL_REQUEST_RESPONSE', 'URGENT_ALERT', 'SYSTEM_NOTIFICATION']
            },
            title: { type: 'string' },
            message: { type: 'string' },
            isRead: { type: 'boolean' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
            actionUrl: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // Error Response
        ErrorResponse: {
          type: 'object',
          required: ['error'],
          properties: {
            error: { type: 'string' },
            status: { type: 'integer' },
            details: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },

      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                error: 'Unauthorized',
                status: 401,
                details: 'Valid authentication token required',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                error: 'Forbidden',
                status: 403,
                details: 'Insufficient permissions for this operation',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                error: 'Not Found',
                status: 404,
                details: 'The requested resource was not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Invalid request data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                error: 'Validation Error',
                status: 400,
                details: 'Request data validation failed',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                error: 'Internal Server Error',
                status: 500,
                details: 'An unexpected error occurred',
              },
            },
          },
        },
      },

      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number (1-based)',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 1 },
        },
        PageSizeParam: {
          name: 'pageSize',
          in: 'query',
          description: 'Number of items per page',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        },
        CaseIdParam: {
          name: 'caseId',
          in: 'path',
          description: 'Unique case identifier',
          required: true,
          schema: { type: 'string' },
          example: 'CYBER-2024-001',
        },
      },

      examples: {
        CreateCaseRequest: {
          summary: 'Create new cyber crime case',
          value: {
            title: 'Online Banking Fraud Investigation',
            description: 'Victim reports unauthorized transactions from their bank account totaling K15,000.',
            offenseType: 'Online Fraud/Scam',
            priority: 'HIGH',
            incidentDate: '2024-01-15T10:30:00Z',
            reportedDate: '2024-01-16T09:00:00Z',
            location: 'Port Moresby, NCD',
            estimatedLoss: 15000,
            currency: 'PGK',
          },
        },

        SearchRequest: {
          summary: 'Search for evidence and cases',
          value: {
            query: 'banking fraud',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            caseTypes: ['Online Fraud/Scam', 'Financial Fraud'],
            priorities: ['HIGH', 'URGENT'],
            page: 1,
            pageSize: 20,
          },
        },

        EvidenceUpload: {
          summary: 'Upload digital evidence',
          value: {
            caseId: 'CYBER-2024-001',
            description: 'Screenshots of fraudulent transactions',
            source: 'Victim mobile phone',
            evidenceType: 'DIGITAL',
            tags: ['screenshots', 'banking', 'fraud'],
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],

    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and session management',
      },
      {
        name: 'Cases',
        description: 'Cyber crime case management operations',
      },
      {
        name: 'Evidence',
        description: 'Digital evidence storage and chain of custody',
      },
      {
        name: 'Search',
        description: 'Advanced search and filtering capabilities',
      },
      {
        name: 'Storage',
        description: 'Cloud storage operations and metrics',
      },
      {
        name: 'Users',
        description: 'User management and profile operations',
      },
      {
        name: 'Notifications',
        description: 'Real-time notifications and alerts',
      },
      {
        name: 'Analytics',
        description: 'System analytics and reporting',
      },
      {
        name: 'Legal Requests',
        description: 'Legal data requests and compliance',
      },
      {
        name: 'Knowledge Base',
        description: 'Training materials and documentation',
      },
    ],
  },

  apis: [
    './src/app/api/**/*.ts', // Include all API route files
    './src/lib/swagger/api-docs/*.yaml', // Include additional documentation files
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
