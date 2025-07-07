import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { db as prisma } from '../../../../lib/db';
// ... existing code ... <rest of the imports and code remains the same>
