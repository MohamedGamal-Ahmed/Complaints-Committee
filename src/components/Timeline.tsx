/**
 * @file src/components/Timeline.tsx
 * @description مكون لعرض الجدول الزمني (Timeline) لتاريخ الشكوى.
 */

import React from 'react';
import { Activity, CheckCircle, Clock } from 'lucide-react';
import { ComplaintHistoryLog, ComplaintStatus } from '../types';

export const Timeline = ({ history }: { history: ComplaintHistoryLog[] }) => {
    if (!history || history.length === 0) return null;

    // ترتيب السجل من الأحدث إلى الأقدم
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="mt-6 pt-6 border-t border-white/5">
            <h6 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Activity className="w-3 h-3" /> سجل المتابعة
            </h6>
            <div className="relative border-r border-white/5 mr-3 space-y-6 pr-6">
                {sortedHistory.map((log, idx) => {
                    const isSolved = log.status === ComplaintStatus.SOLVED;
                    const isNew = log.status === ComplaintStatus.NEW;

                    return (
                        <div key={idx} className="relative group">
                            {/* أيقونة الحالة الجانبية */}
                            <div className={`absolute -right-[31px] top-1 w-6 h-6 rounded-full bg-black flex items-center justify-center border-2 transition-all z-10 
                                ${isSolved ? 'border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                                    isNew ? 'border-club-yellow text-club-yellow shadow-[0_0_10px_rgba(255,204,0,0.3)]' :
                                        'border-blue-500 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}>
                                {isSolved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            </div>

                            <div className="flex flex-col">
                                <span className={`text-xs font-black ${isSolved ? 'text-emerald-400' : 'text-white'}`}>{log.status}</span>
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
                    );
                })}
            </div>
        </div>
    );
};
