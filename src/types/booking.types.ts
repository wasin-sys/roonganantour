// ============================================
// Booking Types
// ============================================

import type { Passenger, BookingType } from './customer.types';

/** Booking group definition */
export interface BookingGroup {
    groupId: string;
    name: string;
    roundId: number;
    totalAmount: number;
    paidAmount: number;
    balance: number;
    bookingType: BookingType;
}

/** Booking record */
export interface Booking {
    id: number;
    roundId: number;
    round?: { id: number };
    routeId?: number;
    saleId: number;
    status: 'pending' | 'partial' | 'paid' | string;
    pax: Passenger[];
    customerName: string;
    contactName: string;
    contactPhone: string;
    saleName: string;
    details?: BookingDetails;
}

/** Booking details form */
export interface BookingDetails {
    contactName: string;
    specialRequest: string;
    discount: number;
    tourCode: string;
}

/** Booking type constants */
export const BOOKING_TYPES = {
    INDIVIDUAL: 'individual' as const,
    GROUP: 'group' as const,
} as const;
