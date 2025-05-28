import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Device detection utilities
 */
export const deviceUtils = {
  /**
   * Check if the current device is mobile
   */
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    // Check user agent for mobile indicators
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
           // Check for touch capability and small screen
           ('ontouchstart' in window && window.innerWidth <= 768);
  },

  /**
   * Check if the device supports tel: links effectively
   */
  supportsTelLinks: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    // Mobile devices and some desktop apps support tel: links well
    return deviceUtils.isMobile() || 
           // Check for specific desktop apps that handle tel: links
           navigator.userAgent.includes('Skype') ||
           navigator.userAgent.includes('Teams');
  },

  /**
   * Handle phone number click with device-appropriate behavior
   */
  handlePhoneClick: (phoneNumber: string): void => {
    if (deviceUtils.supportsTelLinks()) {
      // Use tel: link for mobile and supported desktop apps
      window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
    } else {
      // For desktop, copy to clipboard and show notification
      navigator.clipboard.writeText(phoneNumber).then(() => {
        // Show a temporary notification
        const notification = document.createElement('div');
        notification.textContent = `Phone number ${phoneNumber} copied to clipboard`;
        notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity';
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 3000);
      }).catch(() => {
        // Fallback: show alert with phone number
        alert(`Please call: ${phoneNumber}`);
      });
    }
  }
};

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (US format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 