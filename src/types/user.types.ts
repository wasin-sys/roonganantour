// ============================================
// User & Authentication Types
// ============================================

/** User role in the system */
export type UserRole = 'MANAGER' | 'SALE' | 'GUIDE';

/** Staff member in the tour company */
export interface User {
    id: number;
    name: string;
    role: UserRole;
    commissionRank: number | null;
    avatar: string;
    email?: string;
}

/** Commission rank definition */
export interface CommissionRank {
    id: number;
    name: string;
    defaultAmount: number;
    color: string;
    bg: string;
    border: string;
}
