/**
 * Comprehensive TypeScript types for Claim Connectors Landing Page
 * These types define the structure for tracking, analytics, forms, and business logic
 */

// ============= Tracking Types =============
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string; // Google Click ID
  fbclid?: string; // Facebook Click ID
  msclkid?: string; // Microsoft Click ID
}

export interface TrackingEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface TrackingContext {
  utm: UTMParams;
  referrer: string;
  landingPage: string;
  userAgent: string;
  ip?: string;
  location?: GeolocationData;
}

// ============= Form Types =============
export interface LeadFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Accident Information
  accidentType: AccidentType;
  accidentDate: string;
  injuryDescription: string;
  medicalTreatment: boolean;
  propertyDamage: boolean;
  
  // Location
  state: string;
  city: string;
  zipCode: string;
  
  // Legal Status
  hasAttorney: boolean;
  policeReport: boolean;
  insuranceClaim: boolean;
  
  // Additional
  message?: string;
  consent: boolean;
  
  // Tracking
  source?: string;
  utm?: UTMParams;
  timestamp?: number;
}

export enum AccidentType {
  CAR = 'car_accident',
  TRUCK = 'truck_accident',
  MOTORCYCLE = 'motorcycle_accident',
  PEDESTRIAN = 'pedestrian_accident',
  SLIP_FALL = 'slip_and_fall',
  WORKPLACE = 'workplace_accident',
  MEDICAL = 'medical_malpractice',
  PRODUCT = 'product_liability',
  OTHER = 'other'
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: string[];
  validation?: any; // Zod schema
}

export interface FormState {
  currentStep: number;
  data: Partial<LeadFormData>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isComplete: boolean;
}

// ============= Geolocation Types =============
export interface GeolocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  timezone?: string;
}

export interface NearbyLocation {
  name: string;
  address: string;
  distance: number;
  phone?: string;
  hours?: BusinessHours;
}

// ============= Business Types =============
export interface BusinessHours {
  monday: HoursRange;
  tuesday: HoursRange;
  wednesday: HoursRange;
  thursday: HoursRange;
  friday: HoursRange;
  saturday: HoursRange;
  sunday: HoursRange;
  holidays?: Holiday[];
}

export interface HoursRange {
  open: string;
  close: string;
  closed?: boolean;
}

export interface Holiday {
  date: string;
  name: string;
  hours?: HoursRange;
}

// ============= Analytics Types =============
export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  duration?: number;
  scrollDepth?: number;
  exitPoint?: string;
}

export interface ConversionEvent {
  type: ConversionType;
  value?: number;
  metadata?: Record<string, any>;
}

export enum ConversionType {
  FORM_START = 'form_start',
  FORM_STEP = 'form_step',
  FORM_COMPLETE = 'form_complete',
  PHONE_CLICK = 'phone_click',
  CHAT_START = 'chat_start',
  EMAIL_CLICK = 'email_click',
  CTA_CLICK = 'cta_click'
}

// ============= A/B Testing Types =============
export interface ABTestVariant {
  id: string;
  name: string;
  weight: number;
  config: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  variants: ABTestVariant[];
  metrics: string[];
  status: 'active' | 'paused' | 'completed';
}

// ============= UI Component Types =============
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: React.ReactNode;
  tracking?: {
    category: string;
    action: string;
    label?: string;
  };
}

export interface CardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  animate?: boolean;
  animationDelay?: number;
}

export interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  background?: 'white' | 'gray' | 'dark' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// ============= Animation Types =============
export interface AnimationConfig {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  viewport?: any;
}

export interface ParallaxConfig {
  speed?: number;
  offset?: number;
  easing?: string;
}

// ============= API Types =============
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: {
    timestamp: number;
    requestId: string;
    version: string;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// ============= Session Types =============
export interface UserSession {
  id: string;
  startTime: number;
  lastActivity: number;
  pageViews: PageView[];
  events: TrackingEvent[];
  formProgress?: FormState;
  abTests?: Record<string, string>;
}

// ============= Notification Types =============
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============= SEO Types =============
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  jsonLd?: any;
}

// ============= Performance Types =============
export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  tti: number; // Time to Interactive
}

// ============= Cookie Consent Types =============
export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp?: number;
  ip?: string;
}

// ============= Chat Types =============
export interface ChatConfig {
  enabled: boolean;
  provider: 'intercom' | 'drift' | 'zendesk' | 'custom';
  config: Record<string, any>;
  businessHours?: BusinessHours;
  offlineMessage?: string;
}

// ============= Legal Types =============
export interface LegalDisclaimer {
  id: string;
  type: 'disclaimer' | 'privacy' | 'terms';
  content: string;
  version: string;
  effectiveDate: string;
  required: boolean;
} 