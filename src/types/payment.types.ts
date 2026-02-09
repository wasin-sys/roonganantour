// ============================================
// Payment & Financial Document Types
// ============================================

import type { BookingType } from './customer.types';

/** Document status */
export type DocumentStatus = 'draft' | 'pending' | 'partial' | 'paid' | 'cancelled';

/** Payment method */
export type PaymentMethod = 'cash' | 'transfer';

/** Transaction verification status */
export type TransactionStatus = 'pending_verify' | 'verified' | 'rejected';

/** Document status constants */
export const DOCUMENT_STATUS = {
    DRAFT: 'draft' as const,
    PENDING: 'pending' as const,
    PARTIAL: 'partial' as const,
    PAID: 'paid' as const,
    CANCELLED: 'cancelled' as const,
} as const;

/** Payment method constants */
export const PAYMENT_METHODS = {
    CASH: 'cash' as const,
    TRANSFER: 'transfer' as const,
} as const;

/** Transaction status constants */
export const TRANSACTION_STATUS = {
    PENDING_VERIFY: 'pending_verify' as const,
    VERIFIED: 'verified' as const,
    REJECTED: 'rejected' as const,
} as const;

/** Bank account */
export interface BankAccount {
    id: number;
    bank: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    color: string;
}

/** Payment transaction */
export interface PaymentTransaction {
    id: number;
    date: string;
    amount: number;
    method: PaymentMethod;
    receipt: string;
    status: TransactionStatus;
    verifiedBy?: number | null;
    verifiedAt?: string | null;
}

/** Payment record */
export interface Payment {
    id: number;
    bookingId: number;
    routeId: number;
    roundId: number;
    saleId: number;
    customerName: string;
    totalAmount: number;
    paidAmount: number;
    status: 'pending' | 'partial' | 'paid';
    createdAt: string;
    paxIds: number[];
    transactions: PaymentTransaction[];
}

/** Billing note (ใบวางบิล) */
export interface BillingNote {
    id: string;
    paymentId: number;
    roundId: number;
    routeId: number;
    groupId: string | null;
    bookingId?: number;
    customerName: string;
    customerTaxId?: string;
    customerAddress?: string;
    billingType: BookingType;
    paxIds: number[];
    totalAmount: number;
    previousPaid: number;
    billingAmount: number;
    paidAmount: number;
    status: 'pending' | 'partial' | 'paid';
    createdAt: string;
    createdBy: number;
    dueDate: string;
    paymentMethod: PaymentMethod | null;
    bankAccountId: number | null;
    paidAt?: string;
    isDeposit?: boolean;
    note: string;
}

/** Receipt (ใบเสร็จรับเงิน) */
export interface Receipt {
    id: string;
    billingNoteId: string | null;
    paymentId: number;
    roundId: number;
    routeId: number;
    customerName: string;
    paxIds: number[];
    totalAmount: number;
    receiptAmount: number;
    paymentMethod: PaymentMethod | string;
    bankAccountId: number | null;
    transferSlip?: string | null;
    slipFileName?: string | null;
    slipFile?: string | null;
    status: 'issued' | 'used_for_tax' | 'pending_verify' | 'verified' | 'rejected' | string;
    createdAt: string;
    createdBy: number;
    submittedBy?: number | null;
    submittedByName?: string | null;
    note: string;
    usedForTaxInvoice: boolean;
    taxInvoiceId: string | null;
    rejectionReason?: string | null;
    isDeposit?: boolean;
    verifiedBy?: number | null;
    verifiedAt?: string | null;
}

/** Tax invoice customer type */
export type TaxInvoiceCustomerType = 'individual' | 'juridical';

/** Tax invoice (ใบกำกับภาษี) */
export interface TaxInvoice {
    id: string;
    runningNumber: string;
    receiptIds: string[];
    paymentId: number;
    roundId: number;
    routeId: number;
    customerType: TaxInvoiceCustomerType;
    customerName: string;
    taxId: string;
    address: string;
    subtotal: number;
    vatAmount: number;
    totalAmount: number;
    status: 'draft' | 'issued' | 'cancelled';
    createdAt: string;
    createdBy: number;
    issuedAt: string;
    note: string;
}

/** Payment gateway configuration */
export interface PaymentGatewayConfig {
    enabled: boolean;
    provider: string;
    merchantId: string;
    merchantName: string;
    qrCodeBaseUrl: string;
}

/** Billing info for payment form */
export interface BillingInfo {
    type: 'individual' | 'company';
    name: string;
    taxId: string;
    address: string;
    email: string;
    phone: string;
}

/** Payment form data */
export interface PaymentFormData {
    method: PaymentMethod | '';
    amount: number;
    receipt: File | null;
    note: string;
    slipFileName?: string;
    slipFile?: string;
}

/** Tax invoice form data */
export interface TaxInvoiceFormData {
    customerType: TaxInvoiceCustomerType;
    customerName?: string;
    taxId?: string;
    address?: string;
}
