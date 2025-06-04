/**
 * API endpoint for lead form submission
 * Handles validation, storage, and notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { LeadFormData, APIResponse, AccidentType } from '@/types';
import { ClaimConnectorsService } from '@/lib/claim-connectors';

// Lead validation schema
const leadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\d{3}-?\d{3}-?\d{4}$/),
  accidentType: z.nativeEnum(AccidentType),
  accidentDate: z.string(),
  injuryDescription: z.string().min(10),
  medicalTreatment: z.boolean(),
  propertyDamage: z.boolean(),
  state: z.string().min(2),
  city: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  hasAttorney: z.boolean(),
  policeReport: z.boolean(),
  insuranceClaim: z.boolean(),
  message: z.string().optional(),
  consent: z.boolean(),
});

// Email notification service (placeholder - implement with your email service)
async function sendEmailNotification(lead: LeadFormData) {
  // Implement email service integration
  // Example: SendGrid, AWS SES, etc.
  
  if (!process.env.EMAIL_SERVICE_API_KEY || !process.env.NOTIFICATION_EMAIL) {
    console.warn('Email service not configured');
    return;
  }

  try {
    // Placeholder for email sending logic
    const emailData = {
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Lead: ${lead.firstName} ${lead.lastName} - ${lead.accidentType}`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${lead.firstName} ${lead.lastName}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        <p><strong>Accident Type:</strong> ${lead.accidentType}</p>
        <p><strong>Accident Date:</strong> ${lead.accidentDate}</p>
        <p><strong>Location:</strong> ${lead.city}, ${lead.state} ${lead.zipCode}</p>
        <p><strong>Description:</strong> ${lead.injuryDescription}</p>
        ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ''}
        <hr />
        <p><strong>Medical Treatment:</strong> ${lead.medicalTreatment ? 'Yes' : 'No'}</p>
        <p><strong>Property Damage:</strong> ${lead.propertyDamage ? 'Yes' : 'No'}</p>
        <p><strong>Police Report:</strong> ${lead.policeReport ? 'Yes' : 'No'}</p>
        <p><strong>Insurance Claim:</strong> ${lead.insuranceClaim ? 'Yes' : 'No'}</p>
        <p><strong>Has Attorney:</strong> ${lead.hasAttorney ? 'Yes' : 'No'}</p>
        <hr />
        <p><strong>UTM Source:</strong> ${lead.utm?.utm_source || 'Direct'}</p>
        <p><strong>UTM Campaign:</strong> ${lead.utm?.utm_campaign || 'None'}</p>
      `,
    };

    // Send email using your service
    console.log('Sending email notification:', emailData);
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}

// SMS notification service (placeholder)
async function sendSMSNotification(lead: LeadFormData) {
  // Implement SMS service integration
  // Example: Twilio, AWS SNS, etc.
  
  try {
    // Placeholder for SMS sending logic
    console.log(`SMS Alert: New lead from ${lead.firstName} ${lead.lastName} - ${lead.phone}`);
  } catch (error) {
    console.error('Failed to send SMS notification:', error);
  }
}

// Save lead to database (placeholder)
async function saveLeadToDatabase(lead: LeadFormData) {
  // Implement database storage
  // Example: PostgreSQL, MongoDB, etc.
  
  try {
    // Placeholder for database logic
    console.log('Saving lead to database:', lead);
    
    // Return a mock lead ID
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  } catch (error) {
    console.error('Failed to save lead to database:', error);
    throw error;
  }
}

// Calculate lead score based on criteria
function calculateLeadScore(lead: LeadFormData): number {
  let score = 0;
  
  // Score based on accident type
  const highValueAccidents = [AccidentType.TRUCK, AccidentType.MOTORCYCLE, AccidentType.MEDICAL];
  if (highValueAccidents.includes(lead.accidentType)) {
    score += 30;
  } else {
    score += 20;
  }
  
  // Score based on injuries and treatment
  if (lead.medicalTreatment) score += 20;
  if (lead.propertyDamage) score += 10;
  if (lead.policeReport) score += 10;
  
  // Score based on timing (recent accidents score higher)
  const daysSinceAccident = Math.floor(
    (Date.now() - new Date(lead.accidentDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceAccident < 7) score += 20;
  else if (daysSinceAccident < 30) score += 10;
  
  // No attorney bonus
  if (!lead.hasAttorney) score += 20;
  
  return Math.min(score, 100);
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate lead data
    const validationResult = leadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<APIResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid form data',
          details: validationResult.error.flatten(),
        },
        metadata: {
          timestamp: Date.now(),
          requestId: crypto.randomUUID(),
          version: '1.0.0',
        },
      }, { status: 400 });
    }

    const lead: LeadFormData = {
      ...validationResult.data,
      timestamp: Date.now(),
      source: body.source || 'website',
      utm: body.utm || {},
    };

    // Calculate lead score
    const leadScore = calculateLeadScore(lead);

    // Save to database
    const leadId = await saveLeadToDatabase(lead);

    // Submit to Claim Connectors CRM (non-blocking)
    let crmSubmissionResult;
    try {
      crmSubmissionResult = await ClaimConnectorsService.submitLead({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        state: lead.state,
        accidentType: lead.accidentType,
      });

      if (crmSubmissionResult.success) {
        console.log('✅ Lead submitted to Claim Connectors CRM:', crmSubmissionResult.leadId);
      } else {
        console.warn('⚠️ CRM submission failed:', crmSubmissionResult.error);
      }
    } catch (crmError) {
      console.error('🚨 Claim Connectors CRM error (non-blocking):', crmError);
      crmSubmissionResult = { success: false, error: 'CRM submission failed' };
    }

    // Send notifications (async, don't wait)
    Promise.all([
      sendEmailNotification(lead),
      leadScore > 70 ? sendSMSNotification(lead) : Promise.resolve(),
    ]).catch(error => {
      console.error('Notification error:', error);
    });

    // Return success response with CRM submission status
    const successMessage = crmSubmissionResult?.success 
      ? 'Thank you for your submission. We will contact you within 24 hours.'
      : 'Thank you for your submission. We will contact you within 24 hours. (Note: CRM submission had issues but your lead was saved successfully)';

    return NextResponse.json<APIResponse>({
      success: true,
      data: {
        leadId,
        message: successMessage,
        leadScore,
        crmSubmission: {
          success: crmSubmissionResult?.success || false,
          crmLeadId: crmSubmissionResult?.leadId,
          error: crmSubmissionResult?.error
        }
      },
      metadata: {
        timestamp: Date.now(),
        requestId: crypto.randomUUID(),
        version: '1.0.0',
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Lead submission error:', error);
    
    return NextResponse.json<APIResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while processing your request',
      },
      metadata: {
        timestamp: Date.now(),
        requestId: crypto.randomUUID(),
        version: '1.0.0',
      },
    }, { status: 500 });
  }
}

// OPTIONS method for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 