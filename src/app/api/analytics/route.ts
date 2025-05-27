/**
 * First-party analytics endpoint that works with ad blockers
 * Collects and processes tracking events
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { TrackingEvent, APIResponse } from '@/types';

// Event validation schema
const trackingEventSchema = z.object({
  category: z.string(),
  action: z.string(),
  label: z.string().optional(),
  value: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.number(),
  sessionId: z.string(),
  userId: z.string().optional(),
});

// Store events in memory (replace with database in production)
const eventStore: TrackingEvent[] = [];

// Process and enrich event data
function enrichEventData(event: TrackingEvent, request: NextRequest) {
  const enrichedEvent = { ...event };
  
  // Add server-side data
  enrichedEvent.metadata = {
    ...enrichedEvent.metadata,
    serverTimestamp: Date.now(),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || 'direct',
  };

  return enrichedEvent;
}

// Send events to third-party services (server-side)
async function forwardToThirdParty(event: TrackingEvent) {
  try {
    // Google Analytics Measurement Protocol
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      const gaPayload = new URLSearchParams({
        v: '1',
        tid: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        cid: event.sessionId,
        t: 'event',
        ec: event.category,
        ea: event.action,
        el: event.label || '',
        ev: event.value?.toString() || '',
      });

      fetch('https://www.google-analytics.com/collect', {
        method: 'POST',
        body: gaPayload,
      }).catch(error => console.error('GA forward error:', error));
    }

    // Facebook Conversions API
    if (process.env.NEXT_PUBLIC_FB_PIXEL_ID && process.env.FB_CONVERSIONS_API_TOKEN) {
      const fbPayload = {
        data: [{
          event_name: event.action,
          event_time: Math.floor(event.timestamp / 1000),
          event_id: `${event.sessionId}_${event.timestamp}`,
          user_data: {
            client_user_agent: event.metadata?.userAgent,
            client_ip_address: event.metadata?.ip,
          },
          custom_data: {
            category: event.category,
            label: event.label,
            value: event.value,
            ...event.metadata,
          },
        }],
      };

      fetch(`https://graph.facebook.com/v13.0/${process.env.NEXT_PUBLIC_FB_PIXEL_ID}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.FB_CONVERSIONS_API_TOKEN}`,
        },
        body: JSON.stringify(fbPayload),
      }).catch(error => console.error('FB forward error:', error));
    }
  } catch (error) {
    console.error('Third-party forwarding error:', error);
  }
}

// Batch process events
let eventBatch: TrackingEvent[] = [];
let batchTimeout: NodeJS.Timeout | null = null;

function processBatch() {
  if (eventBatch.length === 0) return;

  // Process batch (save to database, send to services, etc.)
  console.log(`Processing batch of ${eventBatch.length} events`);
  
  // Forward each event to third-party services
  eventBatch.forEach(event => {
    forwardToThirdParty(event);
  });

  // Clear batch
  eventBatch = [];
}

function addToBatch(event: TrackingEvent) {
  eventBatch.push(event);

  // Process batch if it reaches size limit
  if (eventBatch.length >= 10) {
    processBatch();
    if (batchTimeout) {
      clearTimeout(batchTimeout);
      batchTimeout = null;
    }
  } else {
    // Set timeout to process batch after delay
    if (!batchTimeout) {
      batchTimeout = setTimeout(() => {
        processBatch();
        batchTimeout = null;
      }, 5000); // 5 seconds
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Handle batch events
    const events = Array.isArray(body) ? body : [body];
    
    const validEvents: TrackingEvent[] = [];
    const errors: any[] = [];

    // Validate each event
    for (const event of events) {
      const validationResult = trackingEventSchema.safeParse(event);
      if (validationResult.success) {
        const enrichedEvent = enrichEventData(validationResult.data, request);
        validEvents.push(enrichedEvent);
      } else {
        errors.push({
          event,
          error: validationResult.error.flatten(),
        });
      }
    }

    // Process valid events
    validEvents.forEach(event => {
      // Store event (replace with database in production)
      eventStore.push(event);
      
      // Add to batch for third-party forwarding
      addToBatch(event);
    });

    // Return response
    if (errors.length > 0 && validEvents.length === 0) {
      return NextResponse.json<APIResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'All events failed validation',
          details: errors,
        },
        metadata: {
          timestamp: Date.now(),
          requestId: crypto.randomUUID(),
          version: '1.0.0',
        },
      }, { status: 400 });
    }

    return NextResponse.json<APIResponse>({
      success: true,
      data: {
        processed: validEvents.length,
        failed: errors.length,
        errors: errors.length > 0 ? errors : undefined,
      },
      metadata: {
        timestamp: Date.now(),
        requestId: crypto.randomUUID(),
        version: '1.0.0',
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Analytics error:', error);
    
    return NextResponse.json<APIResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process analytics events',
      },
      metadata: {
        timestamp: Date.now(),
        requestId: crypto.randomUUID(),
        version: '1.0.0',
      },
    }, { status: 500 });
  }
}

// GET endpoint for analytics dashboard (optional)
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Filter events
    let filteredEvents = [...eventStore];
    
    if (sessionId) {
      filteredEvents = filteredEvents.filter(e => e.sessionId === sessionId);
    }
    
    if (category) {
      filteredEvents = filteredEvents.filter(e => e.category === category);
    }

    // Sort by timestamp descending and limit
    filteredEvents.sort((a, b) => b.timestamp - a.timestamp);
    filteredEvents = filteredEvents.slice(0, limit);

    // Calculate summary statistics
    const summary = {
      totalEvents: filteredEvents.length,
      uniqueSessions: new Set(filteredEvents.map(e => e.sessionId)).size,
      categories: [...new Set(filteredEvents.map(e => e.category))],
      timeRange: filteredEvents.length > 0 ? {
        start: new Date(filteredEvents[filteredEvents.length - 1].timestamp),
        end: new Date(filteredEvents[0].timestamp),
      } : null,
    };

    return NextResponse.json<APIResponse>({
      success: true,
      data: {
        events: filteredEvents,
        summary,
      },
      metadata: {
        timestamp: Date.now(),
        requestId: crypto.randomUUID(),
        version: '1.0.0',
      },
    });

  } catch (error) {
    console.error('Analytics GET error:', error);
    
    return NextResponse.json<APIResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve analytics data',
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 