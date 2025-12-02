/**
 * Health Check Endpoint
 * =====================
 * 
 * Returns server status for load balancers and monitoring.
 * 
 * GET /api/health → { status: 'ok', timestamp: '...' }
 * 
 * Use this endpoint to:
 * - Configure load balancer health checks
 * - Monitor uptime with external services
 * - Verify deployments succeeded
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}

