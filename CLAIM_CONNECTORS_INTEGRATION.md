# Claim Connectors CRM Integration

## Overview

This document describes the integration with Claim Connectors API for Justin Lander's CRM system. When leads are submitted through the form, they are automatically forwarded to the external CRM system.

## API Configuration

### Credentials
- **Publisher Name**: Inhouse
- **Contact Email**: asiegel@contentkingpins.com
- **Vendor Code**: `PUB0404481OHF`
- **Tracking ID**: `TRK_QXLDSZDW`
- **API Key**: `api_roq0m2i63m`
- **Status**: Active
- **API Endpoint**: `https://9qtb4my1ij.execute-api.us-east-1.amazonaws.com/prod/leads`

### Required Headers
```
Content-Type: application/json
X-API-Key: api_roq0m2i63m
X-Vendor-Code: PUB0404481OHF
X-Tracking-ID: TRK_QXLDSZDW
```

## Implementation

### Service File: `src/lib/claim-connectors.ts`
- Contains the `ClaimConnectorsService` class
- Handles API authentication and request formatting
- Maps form accident types to CRM incident types
- Provides error handling and logging

### Integration Point: `src/app/api/submit-lead/route.ts`
The integration is added to the existing lead submission workflow:

1. **Form Validation**: Zod schema validation
2. **Database Storage**: Save to DynamoDB
3. **🆕 CRM Submission**: Submit to Claim Connectors API
4. **Email Notification**: Send internal notification
5. **Google Ads Tracking**: Track conversion
6. **Response**: Return success/failure status

### Accident Type Mapping
The system maps form accident types to CRM incident types:

```javascript
const incidentTypeMap = {
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
```

## Testing

### Test Endpoint: `/api/claim-connectors/test`

**GET Request**: Test API connectivity
```bash
curl https://your-domain.com/api/claim-connectors/test
```

**POST Request**: Test with custom lead data
```bash
curl -X POST https://your-domain.com/api/claim-connectors/test \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "5551234567",
    "state": "CA",
    "accidentType": "car_accident"
  }'
```

## Data Flow

1. **User submits form** → Form validation
2. **Lead saved to database** → DynamoDB storage
3. **Lead sent to CRM** → Claim Connectors API
4. **Email notification** → Internal team notification
5. **Conversion tracking** → Google Ads conversion
6. **Response returned** → Success/failure status with CRM info

## Error Handling

- **Non-blocking**: CRM submission errors don't fail the entire request
- **Logging**: All API calls and responses are logged
- **Fallback**: System continues to function if CRM is unavailable
- **Response tracking**: API response includes CRM submission status

## Sample API Response

```json
{
  "success": true,
  "message": "Lead submitted successfully to CRM and conversion tracked",
  "data": {
    "leadId": "lead_123456789",
    "crmSubmission": {
      "success": true,
      "crmLeadId": "CC_LEAD_789123",
      "error": null
    }
  },
  "timestamp": "2025-01-04T12:00:00.000Z"
}
```

## Support

**Claim Connectors Support:**
- Email: publishers@claimconnectors.com
- Phone: (555) CLAIM-01

## Security Notes

- API credentials are hardcoded in the service file
- Consider moving to environment variables for production
- API requests are made server-side only
- No sensitive data exposed to frontend

## Monitoring

- Check server logs for CRM submission status
- Monitor `/api/claim-connectors/test` endpoint for connectivity
- Review lead submission success rates in analytics 