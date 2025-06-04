/**
 * API endpoint for accident form submission
 */

import { NextRequest, NextResponse } from 'next/server';

interface AccidentFormData {
  // Step 1: Contact Information
  zipCode: string;
  email: string;
  phoneNumber: string;
  
  // Step 2: Accident Details
  accidentType: string;
  role: string;
  atFault: string;
  incidentDate: string;
  medicalAttention: string;
  
  // Step 3: Description
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData: AccidentFormData = await request.json();

    // Validate required fields
    const { zipCode, email, phoneNumber, accidentType, role, atFault, incidentDate, medicalAttention, description } = formData;
    
    if (!zipCode || !email || !phoneNumber || !accidentType || !role || !atFault || !incidentDate || !medicalAttention || !description) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Additional validation
    if (!zipCode.match(/^\d{5}$/)) {
      return NextResponse.json(
        { error: 'Please enter a valid 5-digit ZIP code' },
        { status: 400 }
      );
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!phoneNumber.match(/^\d{10}$/)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit phone number' },
        { status: 400 }
      );
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const timestamp = new Date().toISOString();

    // Create comprehensive lead data
    const leadData = {
      ...formData,
      type: 'accident_form',
      timestamp,
      ip,
      userAgent,
      source: 'website',
      status: 'new',
      formattedPhone: `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,6)}-${phoneNumber.slice(6,10)}`,
      estimatedValue: getEstimatedCaseValue(formData)
    };

    // Log the submission (in production, you'd save to database)
    console.log('Accident form submission:', leadData);

    // Here you would typically:
    // 1. Save to database
    // 2. Send to CRM (HubSpot, Salesforce, etc.)
    // 3. Send notification emails to attorneys
    // 4. Trigger follow-up workflows
    // 5. Send confirmation email to client

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response with lead ID
    const leadId = `ACC-${Date.now()}-${zipCode}`;

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      leadId,
      estimatedContactTime: '24 hours',
      nextSteps: [
        'A case manager will review your information',
        'You will receive a call within 24 hours',
        'We will connect you with a qualified attorney in your area'
      ]
    });

  } catch (error) {
    console.error('Error processing accident form:', error);
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}

// Helper function to estimate case value based on form data
function getEstimatedCaseValue(data: AccidentFormData): string {
  let value = 'Standard';
  
  // Higher value cases
  if (data.medicalAttention === 'yes') {
    value = 'High';
  }
  
  // Premium cases
  if (data.accidentType === 'truck_accident' || 
      data.accidentType === 'medical_malpractice' ||
      data.accidentType === 'product_liability') {
    value = 'Premium';
  }
  
  return value;
} 