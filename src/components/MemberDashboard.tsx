/**
 * @file src/components/MemberDashboard.tsx
 * @description لوحة تحكم العضو بتصميم "Portfolio" فاخر.
 */

import React from 'react';
import {
    Bell,
    Settings,
    CheckSquare,
    Clock,
    FileText,
    PlusCircle,
    Home,
    LogOut
} from 'lucide-react';
import { User, Complaint, ComplaintStatus } from '../types';
import { StatusBadge, PriorityBadge } from './Common';
import { Timeline } from './Timeline';

interface MemberDashboardProps {
    user: User;
    complaints: Complaint[];
    onChangeView: (view: string) => void;
    onLogout: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
    user,
    complaints,
    onChangeView,
    onLogout
}) => {
    const myComplaints = complaints.filter(c => c.userId === user.id);
    const total = myComplaints.length;
    const solved = myComplaints.filter(c => c.status === ComplaintStatus.SOLVED).length;
    const active = total - solved;

    return (
        <div className="pb-32 animate-fade-in font-['Cairo']">
            {/* الهيدر العلوي */}
            <header className="flex justify-between items-center mb-10 pt-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-club-yellow/20 blur-lg rounded-full animate-pulse"></div>
                        <img src={user.photoUrl} alt="Profile" className="w-14 h-14 rounded-full border-2 border-club-yellow relative z-10 shadow-lg" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">مساء الخير</p>
                        <h1 className="text-xl font-black text-white">{user.name.split(' ')[0]}</h1>
                    </div>
                </div>
                <div className="relative">
                    <button className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-colors">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-club-yellow rounded-full border-2 border-black"></span>
                    </button>
                </div>
            </header>

            {/* ملخص الشكاوى (Hero Section) */}
            <div className="glass rounded-[40px] p-8 mb-10 relative overflow-hidden group border-white/10 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-club-yellow/5 blur-3xl -mr-16 -mt-16 group-hover:bg-club-yellow/10 transition-colors"></div>
                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">إجمالي الشكاوى المسجلة</p>
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-6xl font-black text-white tracking-tighter">{total}</span>
                    <span className="text-club-yellow font-bold text-sm tracking-widest uppercase">شكوى</span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onChangeView('NEW_COMPLAINT')}
                        className="flex-1 bg-club-yellow text-black font-black py-4 rounded-2xl shadow-[0_10px_20px_rgba(255,204,0,0.15)] hover:scale-[1.02] active:scale-95 transition-all text-sm"
                    >
                        شكوى جديدة +
                    </button>
                    <button className="px-6 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-colors active:scale-95">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="mb-8">
                <h3 className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-4 mr-2">إحصائيات المتابعة</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-6 rounded-3xl border-white/5 flex flex-col items-center justify-center group hover:bg-white/5 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-club-green/10 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                            <CheckSquare className="w-6 h-6" />
                        </div>
                        <div className="text-2xl font-black text-white">{solved}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">تم حلها</div>
                    </div>
                    <div className="glass p-6 rounded-3xl border-white/5 flex flex-col items-center justify-center group hover:bg-white/5 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-club-yellow/10 flex items-center justify-center text-club-yellow mb-3 group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div className="text-2xl font-black text-white">{active}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">قيد المراجعة</div>
                    </div>
                </div>
            </div>

            {/* قائمة آخر الشكاوى */}
            <div className="mb-4 pr-1 flex justify-between items-center">
                <h3 className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">آخر النشاطات</h3>
                <button className="text-club-yellow text-[10px] font-black uppercase tracking-widest hover:text-club-gold transition-colors">عرض الكل</button>
            </div>

            <div className="space-y-4">
                {myComplaints.length > 0 ? (
                    myComplaints.map(complaint => (
                        <div key={complaint.id} className="glass rounded-[32px] p-6 border-white/5 hover:bg-white/5 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-club-yellow group-hover:bg-club-yellow group-hover:text-black transition-colors">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-sm">{complaint.subject}</h4>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                            {new Date(complaint.dateCreated).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                                <StatusBadge status={complaint.status} />
                            </div>

                            <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                                {complaint.details}
                            </p>

                            {complaint.status === ComplaintStatus.SOLVED && complaint.resolutionNotes && (
                                <div className="mb-4 p-4 bg-club-yellow/5 border border-club-yellow/20 rounded-2xl">
                                    <p className="text-club-yellow text-[10px] font-black uppercase tracking-widest mb-1">رد الإدارة:</p>
                                    <p className="text-gray-300 text-xs leading-relaxed">{complaint.resolutionNotes}</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-club-yellow animate-pulse"></div>
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{complaint.category}</span>
                                </div>
                                <PriorityBadge priority={complaint.priority} />
                            </div>

                            <Timeline history={complaint.history} />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 glass rounded-[32px] border-dashed border-2 border-white/5">
                        <p className="text-gray-500 font-bold text-sm">لا توجد سجلات حالياً</p>
                    </div>
                )}
            </div>

            {/* الملاحة السفلية (Bottom Navigation) */}
            <div className="fixed bottom-6 left-0 w-full px-6 z-50">
                <nav className="max-w-md mx-auto glass rounded-[32px] p-3 flex justify-between items-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-white/10">
                    <button
                        onClick={() => onChangeView('DASHBOARD')}
                        className="flex-1 flex flex-col items-center py-2 text-club-yellow"
                    >
                        <div className="p-2 rounded-2xl bg-club-yellow/10">
                            <Home className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] mt-1 font-black uppercase tracking-tighter">الرئيسية</span>
                    </button>

                    <div className="relative -mt-12">
                        <button
                            onClick={() => onChangeView('NEW_COMPLAINT')}
                            className="w-16 h-16 bg-club-yellow text-black rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(255,204,0,0.3)] active:scale-90 transition-transform border-4 border-black"
                        >
                            <PlusCircle className="w-8 h-8" />
                        </button>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex-1 flex flex-col items-center py-2 text-gray-500 hover:text-red-500 transition-all"
                    >
                        <div className="p-2 rounded-2xl">
                            <LogOut className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] mt-1 font-black uppercase tracking-tighter">خروج</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};
