/**
 * Business Hours Detector component
 * Detects current business hours and adjusts CTAs based on availability
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BusinessHours, HoursRange } from '@/types';

interface BusinessHoursContextValue {
  isBusinessHours: boolean;
  currentDay: string;
  currentTime: string;
  nextOpenTime: Date | null;
  businessHours: BusinessHours;
}

const BusinessHoursContext = createContext<BusinessHoursContextValue | undefined>(undefined);

// Default business hours configuration
const defaultBusinessHours: BusinessHours = {
  monday: { open: '08:00', close: '18:00' },
  tuesday: { open: '08:00', close: '18:00' },
  wednesday: { open: '08:00', close: '18:00' },
  thursday: { open: '08:00', close: '18:00' },
  friday: { open: '08:00', close: '18:00' },
  saturday: { open: '09:00', close: '14:00' },
  sunday: { closed: true, open: '', close: '' },
  holidays: [
    { date: '2024-12-25', name: 'Christmas', hours: { closed: true, open: '', close: '' } },
    { date: '2024-01-01', name: 'New Year', hours: { closed: true, open: '', close: '' } },
  ],
};

export const BusinessHoursDetector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [businessHours] = useState<BusinessHours>(defaultBusinessHours);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Get timezone from environment or use default
  const timezone = process.env.NEXT_PUBLIC_BUSINESS_TIMEZONE || 'America/New_York';

  // Convert current time to business timezone
  const getBusinessTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long',
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(currentTime);
    
    const hour = parts.find(p => p.type === 'hour')?.value || '00';
    const minute = parts.find(p => p.type === 'minute')?.value || '00';
    const weekday = parts.find(p => p.type === 'weekday')?.value?.toLowerCase() || 'monday';

    return {
      time: `${hour}:${minute}`,
      day: weekday as keyof BusinessHours,
      date: currentTime.toISOString().split('T')[0],
    };
  };

  // Check if current time is within business hours
  const checkBusinessHours = () => {
    const { time, day, date } = getBusinessTime();

    // Check holidays first
    const holiday = businessHours.holidays?.find(h => h.date === date);
    if (holiday) {
      if (holiday.hours?.closed) return false;
      if (holiday.hours) {
        return isTimeInRange(time, holiday.hours);
      }
    }

    // Check regular business hours
    const dayHours = businessHours[day];
    if (!dayHours || Array.isArray(dayHours) || dayHours.closed) return false;

    return isTimeInRange(time, dayHours);
  };

  // Helper function to check if time is in range
  const isTimeInRange = (time: string, range: HoursRange): boolean => {
    if (range.closed) return false;
    
    const [currentHour, currentMinute] = time.split(':').map(Number);
    const [openHour, openMinute] = range.open.split(':').map(Number);
    const [closeHour, closeMinute] = range.close.split(':').map(Number);

    const currentMinutes = currentHour * 60 + currentMinute;
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  };

  // Calculate next open time
  const calculateNextOpenTime = (): Date | null => {
    const { day } = getBusinessTime();
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayIndex = daysOfWeek.indexOf(day);

    // Check next 7 days
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7;
      const nextDay = daysOfWeek[nextDayIndex] as keyof BusinessHours;
      const nextDayHours = businessHours[nextDay];

      if (nextDayHours && !Array.isArray(nextDayHours) && !nextDayHours.closed) {
        const nextDate = new Date(currentTime);
        nextDate.setDate(nextDate.getDate() + i);
        
        const [openHour, openMinute] = nextDayHours.open.split(':').map(Number);
        nextDate.setHours(openHour, openMinute, 0, 0);

        // Check if this date is a holiday
        const dateStr = nextDate.toISOString().split('T')[0];
        const holiday = businessHours.holidays?.find(h => h.date === dateStr);
        if (!holiday || !holiday.hours?.closed) {
          return nextDate;
        }
      }
    }

    return null;
  };

  const isBusinessHours = checkBusinessHours();
  const { time, day } = getBusinessTime();
  const nextOpenTime = !isBusinessHours ? calculateNextOpenTime() : null;

  const contextValue: BusinessHoursContextValue = {
    isBusinessHours,
    currentDay: day,
    currentTime: time,
    nextOpenTime,
    businessHours,
  };

  return (
    <BusinessHoursContext.Provider value={contextValue}>
      {children}
    </BusinessHoursContext.Provider>
  );
};

export const useBusinessHours = () => {
  const context = useContext(BusinessHoursContext);
  if (!context) {
    throw new Error('useBusinessHours must be used within BusinessHoursDetector');
  }
  return context;
}; 