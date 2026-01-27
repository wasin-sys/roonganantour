// ============================================
// Types Index - Re-export all types
// ============================================

// User types
export type { User, UserRole, CommissionRank } from './user.types';

// Tour types
export type {
    Route,
    Round,
    RoundStatus,
    RoundPricing,
    RoomType,
} from './tour.types';

// Customer types
export type {
    Customer,
    CustomerTitle,
    Gender,
    Nationality,
    Passenger,
    PaxAttachments,
    PaymentStatus,
    BookingType,
    CustomerFormState,
    BlacklistEntry,
} from './customer.types';

// Booking types
export type {
    Booking,
    BookingGroup,
    BookingDetails,
} from './booking.types';
export { BOOKING_TYPES } from './booking.types';

// Payment types
export type {
    DocumentStatus,
    PaymentMethod,
    TransactionStatus,
    BankAccount,
    Payment,
    PaymentTransaction,
    BillingNote,
    Receipt,
    TaxInvoice,
    TaxInvoiceCustomerType,
    PaymentGatewayConfig,
    BillingInfo,
    PaymentFormData,
    TaxInvoiceFormData,
} from './payment.types';
export {
    DOCUMENT_STATUS,
    PAYMENT_METHODS,
    TRANSACTION_STATUS,
} from './payment.types';

// Operation types
export type {
    IndividualTask,
    TaskStatus,
    PaxTaskStatuses,
    PaxTaskStatusMap,
    GuideTaskStatuses,
    GuideTaskStatusMap,
    OperationProgress,
    OperationProgressBreakdown,
    Alert,
    AlertType,
} from './operation.types';

// UI types
export type {
    SidebarItemProps,
    StatCardProps,
    AlertBadgeProps,
    NavigationTab,
    CrmSubTab,
    OperationView,
    OperationTab,
    SettingsTab,
    PaymentSubTab,
    BookingAddMode,
} from './ui.types';
