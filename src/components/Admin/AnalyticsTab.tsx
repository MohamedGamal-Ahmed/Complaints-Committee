/**
 * @file src/components/Admin/AnalyticsTab.tsx
 * @description تبويب التحليلات والإحصائيات في لوحة الإدارة — يشمل تقييمات العملاء.
 */

import React from 'react';
import { AlertTriangle, TrendingUp, LayoutDashboard, Star } from 'lucide-react';
import { Complaint, ComplaintStatus } from '../../types';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { CATEGORIES_LIST } from '../../constants';

const COLORS = [
    '#ffcc00', '#3b82f6', '#10b981', '#f43f5e',
    '#8b5cf6', '#06b6d4', '#f97316'
];

interface AnalyticsTabProps {
    complaints: Complaint[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ complaints }) => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const criticalCases = complaints.filter(c =>
        c.status !== ComplaintStatus.SOLVED &&
        c.status !== ComplaintStatus.CLOSED &&
        c.status !== ComplaintStatus.REJECTED &&
        new Date(c.dateCreated) < fiveDaysAgo
    );

    const dataByCategory = CATEGORIES_LIST.map(cat => ({
        name: cat,
        value: complaints.filter(c => c.category === cat).length
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

    const solvedCount = complaints.filter(c => c.status === ComplaintStatus.SOLVED).length;
    const resolutionRate = complaints.length > 0 ? Math.round((solvedCount / complaints.length) * 100) : 0;
    const rankedCategories = [...dataByCategory].sort((a, b) => b.value - a.value);

    // حساب تقييمات العملاء
    const ratedComplaints = complaints.filter(c => c.rating && c.rating > 0);
    const avgRating = ratedComplaints.length > 0
        ? (ratedComplaints.reduce((sum, c) => sum + (c.rating || 0), 0) / ratedComplaints.length).toFixed(1)
        : '0';
    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: ratedComplaints.filter(c => c.rating === stars).length,
        percentage: ratedComplaints.length > 0
            ? Math.round((ratedComplaints.filter(c => c.rating === stars).length / ratedComplaints.length) * 100)
            : 0
    }));

    return (
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

            {/* شبكة المؤشرات السريعة (KPIs) */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-[32px] p-6 border-white/5 bg-gradient-to-br from-club-yellow/5 to-transparent relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-club-yellow/5 rounded-full blur-2xl group-hover:bg-club-yellow/10 transition-all"></div>
                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">نسبة الإغلاق</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">{resolutionRate}%</span>
                        <span className="text-emerald-500 text-[9px] font-bold">+{solvedCount} حل</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-club-yellow" style={{ width: `${resolutionRate}%` }}></div>
                    </div>
                </div>

                <div className="glass rounded-[32px] p-6 border-white/5 bg-gradient-to-br from-red-500/5 to-transparent relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all"></div>
                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">حالات حرجة</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">{criticalCases.length}</span>
                        <span className="text-red-500 text-[9px] font-bold">تحتاج تدخل</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${complaints.length > 0 ? (criticalCases.length / complaints.length) * 100 : 0}%` }}></div>
                    </div>
                </div>
            </div>

            {/* تقييمات العملاء — Customer Satisfaction */}
            <div className="glass rounded-[40px] p-8 border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-black text-sm flex items-center gap-2 tracking-widest uppercase">
                        <Star className="w-4 h-4 text-club-yellow" /> تقييمات العملاء
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{ratedComplaints.length} تقييم</span>
                    </div>
                </div>

                {/* متوسط التقييم */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="text-center">
                        <span className="text-5xl font-black text-white">{avgRating}</span>
                        <div className="flex items-center gap-0.5 mt-2 justify-center">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className={`w-4 h-4 ${i <= Math.round(Number(avgRating)) ? 'text-club-yellow fill-club-yellow' : 'text-gray-700'}`} />
                            ))}
                        </div>
                        <p className="text-[9px] text-gray-500 mt-1 font-bold">المتوسط العام</p>
                    </div>
                    <div className="flex-1 space-y-2">
                        {ratingDistribution.map(item => (
                            <div key={item.stars} className="flex items-center gap-3">
                                <span className="text-[10px] text-gray-400 font-black w-4 text-center">{item.stars}</span>
                                <Star className="w-3 h-3 text-club-yellow fill-club-yellow" />
                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-club-yellow rounded-full transition-all duration-1000"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-[9px] text-gray-500 font-black w-8 text-left">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* أحدث التقييمات */}
                {ratedComplaints.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-white/5">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">أحدث التقييمات</p>
                        {ratedComplaints.slice(0, 3).map(c => (
                            <div key={c.id} className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-white text-xs font-bold">{c.userName}</span>
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className={`w-3 h-3 ${i <= (c.rating || 0) ? 'text-club-yellow fill-club-yellow' : 'text-gray-700'}`} />
                                        ))}
                                    </div>
                                </div>
                                {c.feedback && <p className="text-[10px] text-gray-400 italic">"{c.feedback}"</p>}
                                <p className="text-[8px] text-gray-600 mt-1">#{c.id.split('-').pop()} — {c.subject}</p>
                            </div>
                        ))}
                    </div>
                )}

                {ratedComplaints.length === 0 && (
                    <div className="text-center py-8 opacity-40">
                        <Star className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                        <p className="text-gray-500 text-xs font-bold">لا توجد تقييمات بعد</p>
                    </div>
                )}
            </div>

            {/* قائمة الأقسام الأكثر تعطلاً */}
            <div className="glass rounded-[40px] p-8 border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-black text-sm flex items-center gap-2 tracking-widest uppercase">
                        <TrendingUp className="w-4 h-4 text-club-yellow" /> أكثر الأقسام تعطلاً
                    </h3>
                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">إجمالي التكرار</span>
                </div>
                <div className="space-y-5">
                    {rankedCategories.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-club-yellow font-black">0{idx + 1}</span>
                                    <span className="text-white text-xs font-bold">{item.name}</span>
                                </div>
                                <span className="text-white text-[10px] font-black">{item.value}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${(item.value / complaints.length) * 100}%`,
                                        backgroundColor: COLORS[idx % COLORS.length]
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* الرسم البياني الدائري */}
            <div className="glass rounded-[40px] p-8 border-white/10 shadow-2xl relative overflow-hidden">
                <h3 className="text-white font-black mb-6 text-sm flex items-center gap-2 tracking-widest uppercase">
                    <LayoutDashboard className="w-4 h-4 text-club-yellow" /> تحليل مصادر الشكاوى
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
    );
};
