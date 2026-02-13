/**
 * @file src/components/Timeline.tsx
 * @description مكون لعرض الجدول الزمني (Timeline) لتاريخ الشكوى.
 */

import React from 'react';
import { Activity } from 'lucide-react';
import { ComplaintHistoryLog } from '../types';

export const Timeline = ({ history }: { history: ComplaintHistoryLog[] }) => {
    if (!history || history.length === 0) return null;

    // ترتيب السجل من الأحدث إلى الأقدم
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="mt-6 pt-6 border-t border-white/5">
            <h6 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Activity className="w-3 h-3" /> سجل المتابعة
            </h6>
            <div className="relative border-r border-white/5 mr-2 space-y-6 pr-4">
                {sortedHistory.map((log, idx) => (
                    <div key={idx} className="relative group">
                        {/* الدائرة الجانبية */}
                        <div className="absolute -right-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-black border-2 border-club-yellow group-hover:scale-125 transition-transform z-10 shadow-[0_0_10px_rgba(255,204,0,0.3)]"></div>

                        <div className="flex flex-col">
                            <span className="text-white text-xs font-black">{log.status}</span>
                            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                {new Date(log.date).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                <span className="opacity-30">•</span>
                                {log.updatedBy === 'ADMIN' ? 'الإدارة' : log.updatedBy === 'USER' ? 'العضو' : 'النظام'}
                            </span>
                            {log.note && (
                                <div className="mt-2 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
                                    <p className="text-gray-400 text-[10px] leading-relaxed">
                                        {log.note}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
