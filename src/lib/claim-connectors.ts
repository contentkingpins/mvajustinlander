/**
 * Claim Connectors API Service
 * Handles lead submission to the external CRM via Claim Connectors API
 */

export interface ClaimConnectorsLead {
  first_name: string;
  last_name: string;
  email: string;
  phone_home: string;
  state: string;
  incident_type: string;
  vendor_code: string;
  tracking_id: string;
}

export interface ClaimConnectorsResponse {
  success: boolean;
  message?: string;
  leadId?: string;
  error?: string;
}

export class ClaimConnectorsService {
  private static readonly API_ENDPOINT = 'https://9qtb4my1ij.execute-api.us-east-1.amazonaws.com/prod/leads';
  private static readonly VENDOR_CODE = 'PUB0404481OHF';
  private static readonly API_KEY = 'api_roq0m2i63m';
  private static readonly TRACKING_ID = 'TRK_QXLDSZDW';

  /**
   * Submit lead to Claim Connectors CRM
   */
  static async submitLead(leadData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    state: string;
    accidentType: string;
  }): Promise<ClaimConnectorsResponse> {
    try {
      // Map accident types to incident types expected by Claim Connectors
      const incidentTypeMap: Record<string, string> = {
        'car_accident': 'auto_accident',
        'truck_accident': 'auto_accident',
        'motorcycle_accident': 'auto_accident',
        'bicycle_accident': 'auto_accident',
        'pedestrian_accident': 'auto_accident',
        'slip_and_fall': 'slip_and_fall',
        'medical_malpractice': 'medical_malpractice',
        'product_liability': 'product_liability',
        'workplace_injury': 'workplace_injury',
        'other': 'auto_accident' // Default fallback
      };

      // Format phone number (remove any formatting)
      const formattedPhone = leadData.phone.replace(/[^\d]/g, '');
      const phoneFormatted = `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(3, 6)}-${formattedPhone.slice(6)}`;

      const payload: ClaimConnectorsLead = {
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        email: leadData.email,
        phone_home: phoneFormatted,
        state: leadData.state,
        incident_type: incidentTypeMap[leadData.accidentType] || 'auto_accident',
        vendor_code: this.VENDOR_CODE,
        tracking_id: this.TRACKING_ID
      };

      console.log('🔗 Submitting lead to Claim Connectors:', {
        vendor_code: payload.vendor_code,
        tracking_id: payload.tracking_id,
        incident_type: payload.incident_type,
        state: payload.state
      });

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.API_KEY,
          'X-Vendor-Code': this.VENDOR_CODE,
          'X-Tracking-ID': this.TRACKING_ID,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('❌ Claim Connectors API error:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        
        return {
          success: false,
          error: `API request failed: ${response.status} ${response.statusText}`,
          message: responseData?.message || 'Failed to submit lead to CRM'
        };
      }

      console.log('✅ Lead successfully submitted to Claim Connectors:', responseData);

      return {
        success: true,
        message: 'Lead submitted to CRM successfully',
        leadId: responseData?.id || responseData?.leadId || 'unknown'
      };

    } catch (error) {
      console.error('🚨 Claim Connectors submission error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to submit lead to CRM'
      };
    }
  }

  /**
   * Test API connectivity
   */
  static async testConnection(): Promise<ClaimConnectorsResponse> {
    try {
      // Use a test payload to verify connectivity
      const testPayload: ClaimConnectorsLead = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone_home: '(555) 123-4567',
        state: 'CA',
        incident_type: 'auto_accident',
        vendor_code: this.VENDOR_CODE,
        tracking_id: this.TRACKING_ID
      };

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.API_KEY,
          'X-Vendor-Code': this.VENDOR_CODE,
          'X-Tracking-ID': this.TRACKING_ID,
        },
        body: JSON.stringify(testPayload),
      });

      return {
        success: response.ok,
        message: response.ok ? 'Connection successful' : 'Connection failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }
} 