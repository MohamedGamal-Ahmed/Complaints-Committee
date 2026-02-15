/**
 * @file src/components/Admin/SubscriptionsTab.tsx
 * @description تبويب إدارة طلبات الاشتراك في لوحة الإدارة.
 */

import React, { useState } from 'react';
import { Phone, Clock, Eye, CreditCard, X } from 'lucide-react';
import { SubscriptionRequest } from '../../types';

interface SubscriptionsTabProps {
    subscriptions: SubscriptionRequest[];
    onManageSubscription: (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
}

export const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({
    subscriptions, onManageSubscription
}) => {
    const [selectedSub, setSelectedSub] = useState<SubscriptionRequest | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    return (
        <div className="animate-fade-in space-y-6">
            <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest px-2">طلبات العضوية</h3>
            {subscriptions.filter(s => s.status === 'PENDING').length === 0 ? (
                <div className="text-center py-20 glass rounded-[40px] border-dashed border-2 border-white/5">
                    <p className="text-gray-500 font-bold text-sm">لا توجد طلبات معلقة</p>
                </div>
            ) : (
                subscriptions.filter(s => s.status === 'PENDING').map(sub => (
                    <div key={sub.id} className="glass rounded-[32px] p-6 border-white/5 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-white font-black text-sm">{sub.applicantName}</h4>
                                <p className="text-[10px] text-gray-500 font-bold mt-1 tracking-widest uppercase">ID: {sub.memberId}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-club-yellow/10 flex items-center justify-center text-club-yellow">
                                <CreditCard className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-6">
                            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-club-yellow/50" /> {sub.phoneNumber}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-club-yellow/50" /> {sub.dateApplied}</span>
                        </div>

                        <button
                            onClick={() => setSelectedSub(sub)}
                            className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 border border-white/10 transition-all active:scale-[0.98]"
                        >
                            <Eye className="w-4 h-4" /> مراجعة المستندات والتفعيل
                        </button>
                    </div>
                ))
            )}

            {/* مودال تفعيل العضويات */}
            {selectedSub && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in font-['Cairo']">
                    <div className="glass w-full max-w-md rounded-[40px] border-white/10 p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white">بيانات طلب العضوية</h3>
                            <button onClick={() => setSelectedSub(null)} className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">الاسم بالكامل</p>
                                <p className="text-white font-black text-base">{selectedSub.applicantName}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">رقم العضوية</p>
                                    <p className="text-club-yellow font-black tracking-widest">{selectedSub.memberId}</p>
                                </div>
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1">رقم الهاتف</p>
                                    <p className="text-club-yellow font-black tracking-widest">{selectedSub.phoneNumber}</p>
                                </div>
                            </div>

                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-3">مستند إثبات العضوية</p>
                                <div className="w-full h-56 bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 relative group">
                                    {selectedSub.idCardImage && selectedSub.idCardImage !== 'uploaded' ? (
                                        <img src={selectedSub.idCardImage} alt="ID Card" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-center group-hover:scale-110 transition-transform">
                                            <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-800" />
                                            <p className="text-[10px] text-gray-700 font-black uppercase tracking-widest">Preview Unavailable</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isRejecting ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsRejecting(true)}
                                    className="flex-1 py-4 rounded-2xl bg-red-900/10 text-red-500 font-black text-xs uppercase tracking-widest border border-red-500/10 hover:bg-red-900/20 transition-all"
                                >
                                    رفض الطلب
                                </button>
                                <button
                                    onClick={() => { onManageSubscription(selectedSub.id, 'APPROVED'); setSelectedSub(null); }}
                                    className="flex-1 py-4 rounded-2xl bg-club-yellow text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-club-yellow/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    تفعيل العضوية
                                </button>
                            </div>
                        ) : (
                            <div className="animate-slide-up">
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="اذكر سبب الرفض بوضوح ليتم إبلاغ العضو..."
                                    className="w-full bg-white/5 border border-red-500/20 rounded-2xl p-5 text-white mb-6 h-32 resize-none focus:ring-2 focus:ring-red-500/30 transition-all text-right placeholder:text-gray-800"
                                />
                                <div className="flex gap-4">
                                    <button onClick={() => setIsRejecting(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase tracking-widest">إلغاء</button>
                                    <button
                                        onClick={() => { onManageSubscription(selectedSub.id, 'REJECTED', rejectionReason); setSelectedSub(null); setIsRejecting(false); }}
                                        className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/20 transition-all"
                                    >
                                        تأكيد الرفض
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
