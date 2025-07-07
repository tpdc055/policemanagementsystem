import { NextResponse } from 'next/server';
import { swaggerSpec } from '../../../../lib/swagger/swagger-config';

/**
 * @swagger
 * /api/docs/swagger:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the complete OpenAPI 3.0 specification for the PNG Cyber Crime Monitoring System API
 *     tags: [Documentation]
 *     security: []
 *     responses:
 *       200:
 *         description: OpenAPI specification in JSON format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Complete OpenAPI 3.0 specification
 */
export async function GET() {
  return NextResponse.json(swaggerSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
