/**
 * @file src/components/AdminDashboard.tsx
 * @description لوحة تحكم المسؤول (الأدمن) بتصميم تحليلي متقدم للهواتف.
 */

import React, { useState } from 'react';
import {
    LogOut,
    LayoutDashboard,
    CheckCircle,
    X,
    Eye,
    Phone,
    Clock,
    AlertTriangle,
    CreditCard
} from 'lucide-react';
import {
    Complaint,
    SubscriptionRequest,
    ComplaintStatus,
    Priority,
    ComplaintCategory
} from '../types';
import { StatusBadge, PriorityBadge } from './Common';
import { Timeline } from './Timeline';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { CATEGORIES_LIST } from '../constants';

interface AdminDashboardProps {
    complaints: Complaint[];
    subscriptions: SubscriptionRequest[];
    onUpdateStatus: (id: string, s: ComplaintStatus, notes?: string) => void;
    onLogout: () => void;
    onManageSubscription: (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
}

const COLORS = ['#ffcc00', '#fdb913', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    complaints,
    subscriptions,
    onUpdateStatus,
    onLogout,
    onManageSubscription
}) => {
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SUBSCRIPTIONS' | 'ANALYTICS'>('ANALYTICS');
    const [filter, setFilter] = useState<ComplaintStatus | 'ALL'>('ALL');

    // حالات المودال (Modals)
    const [solvingId, setSolvingId] = useState<string | null>(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [selectedSub, setSelectedSub] = useState<SubscriptionRequest | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    // حساب الحالات الحرجة (> 5 أيام)
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const criticalCases = complaints.filter(c =>
        c.status !== ComplaintStatus.SOLVED &&
        c.status !== ComplaintStatus.CLOSED &&
        c.status !== ComplaintStatus.REJECTED &&
        new Date(c.dateCreated) < fiveDaysAgo
    );

    // بيانات الرسم البياني
    const dataByCategory = CATEGORIES_LIST.map(cat => ({
        name: cat,
        value: complaints.filter(c => c.category === cat).length
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

    const filteredComplaints = filter === 'ALL'
        ? complaints
        : complaints.filter(c => c.status === filter);

    return (
        <div className="pb-32 animate-fade-in font-['Cairo']">
            {/* هيدر الأدمن */}
            <header className="flex justify-between items-center mb-8 pt-4">
                <div>
                    <h1 className="text-2xl font-black text-white mb-1">لوحة الإدارة</h1>
                    <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">التحكم المركزي بالشكاوى</p>
                </div>
                <button onClick={onLogout} className="p-3 bg-red-500/5 text-red-500 rounded-2xl border border-red-500/10 hover:bg-red-500 hover:text-white transition-all group">
                    <LogOut className="w-6 h-6 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                </button>
            </header>

            {/* التبويبات (Tabs) */}
            <div className="flex p-1.5 bg-white/5 rounded-[24px] mb-8 border border-white/5">
                {(['ANALYTICS', 'DASHBOARD', 'SUBSCRIPTIONS'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[18px] transition-all duration-300 ${activeTab === tab ? 'bg-club-yellow text-black shadow-lg scale-100' : 'text-gray-500 hover:text-gray-400 scale-95'}`}
                    >
                        {tab === 'ANALYTICS' ? 'التحليلات' : tab === 'DASHBOARD' ? 'الشكاوى' : 'الاشتراكات'}
                    </button>
                ))}
            </div>

            {/* محتوى التحليلات */}
            {activeTab === 'ANALYTICS' && (
                <div className="animate-fade-in space-y-8">
                    {/* التنبيه للحالات الحرجة */}
                    {criticalCases.length > 0 && (
                        <div className="glass bg-red-900/5 border-red-500/20 rounded-[32px] p-6">
                            <h3 className="text-red-400 font-black mb-2 flex items-center gap-2 text-sm">
                                <AlertTriangle className="w-5 h-5" /> حالات متأخرة ({criticalCases.length})
                            </h3>
                            <p className="text-[10px] text-gray-500 font-bold mb-4 uppercase tracking-wider">شكاوى تجاوزت 5 أيام بدون حل</p>
                            <div className="space-y-3">
                                {criticalCases.slice(0, 3).map(c => (
                                    <div key={c.id} className="bg-white/5 p-3 rounded-2xl flex justify-between items-center border border-white/5">
                                        <span className="text-white text-xs font-bold truncate max-w-[150px]">{c.subject}</span>
                                        <span className="text-[9px] text-gray-600 font-black">{new Date(c.dateCreated).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* الرسم البياني الدائري */}
                    <div className="glass rounded-[40px] p-8 border-white/10 shadow-2xl relative overflow-hidden">
                        <h3 className="text-white font-black mb-6 text-sm flex items-center gap-2 tracking-widest uppercase">
                            <LayoutDashboard className="w-4 h-4 text-club-yellow" /> توزيع المصادر
                        </h3>
                        <div className="h-64 w-full relative mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataByCategory}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {dataByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontFamily: 'Cairo' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {dataByCategory.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: COLORS[idx % COLORS.length], color: COLORS[idx % COLORS.length] }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 text-[9px] font-black uppercase tracking-tighter truncate max-w-[80px]">{item.name}</span>
                                        <span className="text-white text-xs font-black">{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* محتوى الشكاوى */}
            {activeTab === 'DASHBOARD' && (
                <div className="animate-fade-in space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest">إدارة الشكاوى</h3>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as ComplaintStatus | 'ALL')}
                            className="bg-white/5 text-[10px] text-white border border-white/10 rounded-xl py-2 px-4 focus:outline-none font-black uppercase tracking-widest"
                        >
                            <option value="ALL">الكل</option>
                            {Object.values(ComplaintStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        {filteredComplaints.map(complaint => (
                            <div key={complaint.id} className="glass rounded-[32px] p-6 border-white/5 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-club-yellow font-black text-lg">
                                            {complaint.userName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-white text-sm font-black">{complaint.userName}</h4>
                                            <span className="text-[10px] text-gray-500 font-bold"># {complaint.id.split('-').pop()}</span>
                                        </div>
                                    </div>
                                    <StatusBadge status={complaint.status} />
                                </div>

                                <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 mb-6">
                                    <h5 className="text-white text-xs font-black mb-2">{complaint.subject}</h5>
                                    <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2">{complaint.details}</p>
                                </div>

                                <div className="flex justify-between items-center bg-white/5 rounded-2xl p-3">
                                    <PriorityBadge priority={complaint.priority} />
                                    {complaint.status !== ComplaintStatus.SOLVED && (
                                        <button
                                            onClick={() => { setSolvingId(complaint.id); setResolutionNote(''); }}
                                            className="px-5 py-2.5 bg-club-yellow text-black rounded-xl hover:bg-club-gold transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-club-yellow/10 active:scale-95"
                                        >
                                            إغلاق الشكوى
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* محتوى الاشتراكات */}
            {activeTab === 'SUBSCRIPTIONS' && (
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
                </div>
            )}

            {/* مودال الحل (Resolution Modal) */}
            {solvingId && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in font-['Cairo']">
                    <div className="glass w-full max-w-sm rounded-[40px] border-white/10 p-8 shadow-2xl animate-scale-in">
                        <h3 className="text-xl font-black text-white mb-6 text-center">تأكيد حل الشكوى</h3>
                        <textarea
                            value={resolutionNote}
                            onChange={(e) => setResolutionNote(e.target.value)}
                            placeholder="كيف تم حل المشكلة؟ (سيتم إبلاغ العضو)"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white mb-6 h-40 resize-none focus:ring-2 focus:ring-club-yellow/50 transition-all text-right placeholder:text-gray-700"
                        />
                        <div className="flex gap-4">
                            <button onClick={() => setSolvingId(null)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">إلغاء</button>
                            <button
                                onClick={() => { onUpdateStatus(solvingId, ComplaintStatus.SOLVED, resolutionNote); setSolvingId(null); }}
                                className="flex-1 py-4 rounded-2xl bg-club-yellow text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-club-yellow/20 transition-all active:scale-95"
                            >
                                إغلاق نهائي
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تفعيل العضويات (Subscription Modal) */}
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
