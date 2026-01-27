import React from 'react';
import { AlertTriangle, UserCheck, type LucideIcon } from 'lucide-react';
import type { AlertBadgeProps, SidebarItemProps, StatCardProps } from './types';

export const AlertBadge: React.FC<AlertBadgeProps> = ({ type, message }) => {
    const styles = type === 'danger'
        ? 'bg-red-100 text-red-700 border-red-200'
        : 'bg-yellow-100 text-yellow-800 border-yellow-200';
    const Icon = type === 'danger' ? AlertTriangle : UserCheck;

    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-md border ${styles} text-sm font-medium animate-pulse`}>
            <Icon size={16} />
            {message}
        </div>
    );
};

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${active ? 'bg-red-50 text-red-600 border-r-4 border-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </button>
);

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <p className={`text-xs mt-2 font-medium ${color === 'green' ? 'text-green-600' : 'text-blue-600'}`}>{subtext}</p>
        </div>
        <div className={`p-3 rounded-lg ${color === 'green' ? 'bg-green-50 text-green-600' : color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
            <Icon size={24} />
        </div>
    </div>
);
