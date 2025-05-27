/**
 * API endpoint for accident form submission
 */

import { NextRequest, NextResponse } from 'next/server';

interface AccidentFormData {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  comments: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData: AccidentFormData = await request.json();

    // Validate required fields
    const { firstName, lastName, city, state, comments } = formData;
    
    if (!firstName || !lastName || !city || !state || !comments) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const timestamp = new Date().toISOString();

    // Create lead data
    const leadData = {
      ...formData,
      type: 'accident_form',
      timestamp,
      ip,
      userAgent,
      source: 'website',
      status: 'new'
    };

    // Log the submission (in production, you'd save to database)
    console.log('Accident form submission:', leadData);

    // Here you would typically:
    // 1. Save to database
    // 2. Send to CRM
    // 3. Send notification emails
    // 4. Trigger follow-up workflows

    // For now, we'll simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      leadId: `ACC-${Date.now()}` // Generate a simple lead ID
    });

  } catch (error) {
    console.error('Error processing accident form:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 