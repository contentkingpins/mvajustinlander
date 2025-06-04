/**
 * Test endpoint for Claim Connectors API
 * Verifies API connectivity and credentials
 */

import { NextRequest, NextResponse } from 'next/server';
import { ClaimConnectorsService } from '@/lib/claim-connectors';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Claim Connectors API connection...');
    
    const result = await ClaimConnectorsService.testConnection();
    
    return NextResponse.json({
      service: 'claim-connectors-test',
      timestamp: new Date().toISOString(),
      connection: result,
      credentials: {
        vendor_code: 'PUB0404481OHF',
        tracking_id: 'TRK_QXLDSZDW',
        api_endpoint: 'https://9qtb4my1ij.execute-api.us-east-1.amazonaws.com/prod/leads',
        status: result.success ? 'valid' : 'invalid'
      }
    });
    
  } catch (error) {
    console.error('Test endpoint error:', error);
    
    return NextResponse.json({
      service: 'claim-connectors-test',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      connection: {
        success: false,
        error: 'Test endpoint failed'
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Allow testing with custom lead data
    const testLead = {
      firstName: body.firstName || 'Test',
      lastName: body.lastName || 'User',
      email: body.email || 'test@example.com',
      phone: body.phone || '5551234567',
      state: body.state || 'CA',
      accidentType: body.accidentType || 'auto_accident'
    };
    
    console.log('🧪 Testing Claim Connectors API with custom data:', testLead);
    
    const result = await ClaimConnectorsService.submitLead(testLead);
    
    return NextResponse.json({
      service: 'claim-connectors-test',
      timestamp: new Date().toISOString(),
      testLead,
      result,
      status: result.success ? 'success' : 'failed'
    });
    
  } catch (error) {
    console.error('Test POST endpoint error:', error);
    
    return NextResponse.json({
      service: 'claim-connectors-test',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'failed'
    }, { status: 500 });
  }
} 