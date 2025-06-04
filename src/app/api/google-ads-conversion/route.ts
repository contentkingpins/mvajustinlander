<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server"; export async function GET() { return NextResponse.json({ service: "google-ads-conversion", status: "ready", supportedTypes: ["phone", "form"], timestamp: new Date().toISOString() }); } export async function POST(request: NextRequest) { try { const body = await request.json(); if (!body.type) return NextResponse.json({ success: false, error: "Missing type" }, { status: 400 }); const conversionId = "CONV_" + Date.now(); console.log("Google Ads conversion:", body.type, conversionId); return NextResponse.json({ success: true, conversionId, message: body.type + " conversion tracked" }); } catch (error) { return NextResponse.json({ success: false, error: "Failed to track" }, { status: 500 }); } }
=======
 main
﻿import { NextRequest, NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ service: "google-ads-conversion", status: "ready", supportedTypes: ["phone", "form"], features: ["Phone call conversion tracking", "Form submission conversion tracking", "Enhanced conversions with user data", "Debug mode logging", "Analytics integration"], timestamp: new Date().toISOString() }); }

import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Google Ads conversion tracking API is active',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract conversion data
    const {
      conversionLabel,
      conversionValue,
      userData,
      eventName = 'conversion'
    } = body;

    // Validate required fields
    if (!conversionLabel) {
      return NextResponse.json(
        { error: 'Conversion label is required' },
        { status: 400 }
      );
    }

    // Hash user data for enhanced conversions (if provided)
    const hashedUserData = userData ? {
      email: userData.email ? await hashData(userData.email.toLowerCase()) : undefined,
      phone: userData.phone ? await hashData(userData.phone.replace(/\D/g, '')) : undefined,
    } : undefined;

    // Create conversion payload
    const conversionData = {
      conversion_label: conversionLabel,
      conversion_value: conversionValue || 1.0,
      currency: 'USD',
      event_name: eventName,
      enhanced_conversions: hashedUserData ? {
        user_data: hashedUserData
      } : undefined,
      timestamp: new Date().toISOString(),
    };

    // Log conversion for debugging (remove in production)
    console.log('Google Ads Conversion:', conversionData);

    // In production, you would send this to Google Ads API
    // For now, we'll just return success
    
    return NextResponse.json({
      status: 'success',
      message: 'Conversion tracked successfully',
      conversionData,
    });

  } catch (error) {
    console.error('Google Ads conversion error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process conversion',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to hash sensitive data
async function hashData(data: string): Promise<string> {
  if (typeof window !== 'undefined') {
    // Client-side hashing (for reference)
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Server-side hashing
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
 main
>>>>>>> 6115909e74027187310cb4e911f99d9a91074b52
