// ============================================
// Operation & Task Types
// ============================================

import type { LucideIcon } from 'lucide-react';

/** Individual task definition */
export interface IndividualTask {
    key: 'passport' | 'visa' | 'ticket' | 'insurance' | 'prepDoc' | 'payment';
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
}

/** Task status for a single task */
export interface TaskStatus {
    checked: boolean;
    file: string | null;
}

/** All task statuses for a passenger */
export interface PaxTaskStatuses {
    passport: TaskStatus;
    visa: TaskStatus;
    ticket: TaskStatus;
    insurance: TaskStatus;
    prepDoc: TaskStatus;
    payment: TaskStatus;
}

/** Task status map by passenger ID: { [paxId]: { [taskKey]: TaskStatus } } */
export type PaxTaskStatusMap = Record<number, Record<string, TaskStatus>>;

/** Guide task statuses */
export interface GuideTaskStatuses {
    ticket?: boolean;
    hotel?: boolean;
}

/** Guide task status map by round ID */
export type GuideTaskStatusMap = Record<number, GuideTaskStatuses>;

/** Operation progress breakdown */
export interface OperationProgressBreakdown {
    passport: number;
    visa: number;
    ticket: number;
    insurance: number;
    prepDoc: number;
    payment: number;
}

/** Operation progress calculation result */
export interface OperationProgress {
    total: number;
    completed: number;
    percent: number;
    breakdown: OperationProgressBreakdown;
    paxCount: number;
}

/** Alert badge type */
export type AlertType = 'danger' | 'warning';

/** Alert message */
export interface Alert {
    type: AlertType;
    msg: string;
}
