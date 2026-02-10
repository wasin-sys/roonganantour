// ============================================
// UI Component Props Types
// ============================================

import type { LucideIcon } from 'lucide-react';
import type { AlertType } from './operation.types';

/** Sidebar navigation item props */
export interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    active: boolean;
    onClick: () => void;
}

/** Stat card props */
export interface StatCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: LucideIcon;
    color: 'green' | 'blue' | 'cyan';
}

/** Alert badge props */
export interface AlertBadgeProps {
    type: AlertType;
    message: string;
}

/** Navigation tabs */
export type NavigationTab = 'dashboard' | 'booking' | 'operation' | 'crm' | 'payment' | 'settings' | 'customer-dashboard';

/** CRM sub-tab */
export type CrmSubTab = 'customers' | 'blacklist';

/** Operation view mode */
export type OperationView = 'list' | 'detail';

/** Operation list tab */
export type OperationTab = 'upcoming' | 'ongoing' | 'completed';

/** Settings tab */
export type SettingsTab = 'users' | 'bank';

/** Payment sub-tab */
export type PaymentSubTab = 'billing' | 'receipt' | 'tax' | 'pending';

/** Booking add mode */
export type BookingAddMode = 'individual' | 'group' | null;
