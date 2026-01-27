// ============================================
// Tour Routes & Rounds Types
// ============================================

/** Round pricing structure */
export interface RoundPricing {
    adultTwin: number;
    adultSingle: number;
    adultTriple: number;
    childBed: number;
    childNoBed: number;
}

/** Room type for booking */
export type RoomType = keyof RoundPricing | string;

/** Tour route definition */
export interface Route {
    id: number;
    name: string;
    code: string;
    price: number;
    duration: string;
    image: string;
    description: string;
    attachment: string;
    rank1Com: number;
    rank2Com: number;
}

/** Tour round status */
export type RoundStatus = 'Selling' | 'Full' | 'Completed' | string;

/** Tour round (a specific departure date for a route) */
export interface Round {
    id: number;
    routeId: number;
    date: string;
    airline: string;
    flight: string;
    seats: number;
    sold: number;
    paidCount?: number;
    pendingCount?: number;
    partialCount?: number;
    status: RoundStatus;
    headId?: number;
    head: string;
    guideId?: number | null;
    guide?: string;
    price: RoundPricing;
    approved?: boolean;
    approvedBy?: number | null;
    approvedAt?: string | null;
    prepDocument?: string;
}

