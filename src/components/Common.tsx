/**
 * @file src/components/Common.tsx
 * @description المكونات المشتركة والبسيطة المستخدمة في مختلف أنحاء التطبيق.
 */

import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { ComplaintStatus, Priority } from '../types';
import { CLUB_LOGO_URL } from '../constants';

/**
 * مكون شعار النادي مع معالجة الأخطاء
 */
export const ClubLogo = ({ className }: { className?: string }) => {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-club-yellow text-black rounded-full overflow-hidden ${className}`}>
                <Shield className="w-1/2 h-1/2" />
            </div>
        );
    }

    return (
        <img
            src={CLUB_LOGO_URL}
            alt="نادي المقاولون العرب"
            className={`object-contain transition-transform duration-700 hover:rotate-[360deg] ${className}`}
            onError={() => setError(true)}
        />
    );
};

/**
 * مكون شارة الحالة (Status Badge) بتصميم بريميوم
 */
export const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
    const getStyle = (s: ComplaintStatus) => {
        switch (s) {
            case ComplaintStatus.NEW: return 'bg-club-yellow/10 text-club-yellow border-club-yellow/20';
            case ComplaintStatus.SOLVED: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case ComplaintStatus.IN_PROGRESS: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case ComplaintStatus.UNDER_REVIEW: return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case ComplaintStatus.CLOSED: return 'bg-white/5 text-gray-400 border-white/10';
            case ComplaintStatus.REJECTED: return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-white/5 text-white border-white/10';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStyle(status)}`}>
            {status}
        </span>
    );
};

/**
 * مكون شارة الأولوية (Priority Badge)
 */
export const PriorityBadge = ({ priority }: { priority: Priority }) => {
    const getStyle = (p: Priority) => {
        switch (p) {
            case Priority.URGENT: return 'text-red-500 bg-red-500/5 animate-pulse';
            case Priority.HIGH: return 'text-orange-400 bg-orange-500/5';
            case Priority.MEDIUM: return 'text-club-yellow bg-club-yellow/5';
            case Priority.LOW: return 'text-blue-400 bg-blue-500/5';
            default: return 'text-gray-400';
        }
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.1em] border border-white/5 ${getStyle(priority)}`}>
            {priority}
        </span>
    );
};
