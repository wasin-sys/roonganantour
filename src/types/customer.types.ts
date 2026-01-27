// ============================================
// Customer & Passenger Types
// ============================================

import type { RoomType } from './tour.types';

/** Customer title options */
export type CustomerTitle = 'MR' | 'MS' | 'MRS' | 'MSTR' | 'MISS';

/** Gender options */
export type Gender = 'M' | 'F';

/** Nationality options */
export type Nationality = 'THAI' | 'USA' | 'CHINA' | 'UK' | 'OTHER';

/** Payment status for a passenger */
export type PaymentStatus = 'pending' | 'partial' | 'paid';

/** Booking type for grouping */
export type BookingType = 'individual' | 'group';

/** Document attachments for a passenger */
export interface PaxAttachments {
    passport?: string | null;
    visa?: string | null;
    birthCert?: string | null;
    ticket?: string | null;
    insurance?: string | null;
    prepDoc?: string | null;
}

/** Base customer data (stored in CRM) */
export interface Customer {
    id: number;
    title: CustomerTitle;
    firstNameEn: string;
    lastNameEn: string;
    firstNameTh: string;
    lastNameTh: string;
    gender: Gender;
    dob: string;
    passportNo: string;
    passportIssue?: string;
    passportExpire?: string;
    birthplace?: string;
    nationality: Nationality;
    phone: string;
    email?: string;
    lineId?: string;
    remark?: string;
    ownerId: number | null;
}

/** Passenger in a tour round (extends Customer with booking info) */
export interface Passenger extends Customer {
    customerNote?: string;
    roomType?: RoomType;
    room?: string;
    bookedBy?: number;
    paymentStatus?: PaymentStatus;
    paymentDate?: string | null;
    uniqueId?: string;
    groupId?: string | null;
    bookingType?: BookingType;
    groupName?: string;
    attachments?: PaxAttachments;
    paidAmount?: number;
    billingNoteId?: string;
    bookingId?: number;
    roundId?: number;
}

/** Initial customer form state */
export interface CustomerFormState extends Customer {
    attachments?: PaxAttachments | null;
}

/** Blacklisted person */
export interface BlacklistEntry {
    id: number;
    name: string;
    passport: string;
    reason: string;
}
