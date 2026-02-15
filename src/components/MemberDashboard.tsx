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
    LogOut,
    X,
    ChevronRight,
    ChevronLeft,
    TrendingUp,
    Megaphone,
    Send,
    Star
} from 'lucide-react';
import { User, Complaint, ComplaintStatus, Announcement, UserRole } from '../types';
import { StatusBadge, PriorityBadge } from './Common';
import { Timeline } from './Timeline';

interface MemberDashboardProps {
    user: User;
    complaints: Complaint[];
    announcements: Announcement[];
    onChangeView: (view: any) => void;
    onLogout: () => void;
    onSendMessage: (complaintId: string, text: string) => void;
    onRateComplaint: (complaintId: string, rating: number, feedback: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
    user,
    complaints,
    announcements,
    onChangeView,
    onLogout,
    onSendMessage,
    onRateComplaint
}) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
    const [messageText, setMessageText] = React.useState('');
    const [rating, setRating] = React.useState(0);
    const [feedbackText, setFeedbackText] = React.useState('');

    // تحية ديناميكية حسب الوقت
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'صباح الخير';
        if (hour < 17) return 'مساء الخير';
        return 'مساء الخير';
    };

    // الشكاوى الخاصة بالعضو فقط (مفلترة من App.tsx)
    const myComplaints = complaints;
    const total = myComplaints.length;
    const solved = myComplaints.filter(c => c.status === ComplaintStatus.SOLVED).length;
    const active = total - solved;

    // دمج تنبيهات الشكاوى + إشعارات التكليف + أخبار النادي
    const notifications = [
        ...myComplaints.flatMap(c =>
            c.history.map(h => ({
                id: `${c.id}-${h.date}`,
                title: `تحديث شكوى: ${c.subject}`,
                time: h.date,
                type: 'COMPLAINT',
                isNew: new Date(h.date) > new Date(Date.now() - 3600000 * 24)
            }))
        ),
        // إشعارات التكليف — عندما يتم تعيين موظف لشكوى العضو
        ...myComplaints
            .filter(c => c.assignedTo)
            .map(c => ({
                id: `assign-${c.id}`,
                title: `تم تكليف ${c.assignedTo} بالمشكلة رقم #${c.id.split('-').pop()}`,
                time: c.assignmentDate || c.lastUpdated,
                type: 'ASSIGNMENT',
                isNew: true
            })),
        // إشعارات الرسائل — عندما يرد الأدمن أو الموظف على شكوى العضو
        ...myComplaints.flatMap(c =>
            c.messages
                .filter(m => m.senderId !== user.id) // رسائل من غير العضو نفسه
                .map(m => ({
                    id: `msg-${m.id}`,
                    title: `رسالة جديدة من ${m.senderName} في شكوى: ${c.subject}`,
                    time: m.date,
                    type: 'MESSAGE',
                    isNew: new Date(m.date) > new Date(Date.now() - 3600000 * 24)
                }))
        ),
        ...announcements.map(ann => ({
            id: ann.id,
            title: `${ann.category === 'ALERT' ? 'تنبيه: ' : 'خبر: '}${ann.title}`,
            time: ann.date,
            type: 'ANNOUNCEMENT',
            isNew: ann.isUrgent || (new Date(ann.date) > new Date(Date.now() - 3600000 * 24))
        }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 15);

    return (
        <div className="pb-32 animate-fade-in font-['Cairo']">
            {/* الهيدر العلوي */}
            <header className="flex justify-between items-center mb-10 pt-4">
                <div className="flex items-center gap-4">
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-club-yellow/20 blur-lg rounded-full group-hover:bg-club-yellow/30 transition-colors animate-pulse"></div>
                        <img src={user.photoUrl} alt="Profile" className="w-14 h-14 rounded-full border-2 border-club-yellow relative z-10 shadow-lg group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase">{getGreeting()}</p>
                        <h1 className="text-xl font-black text-white">يا {user.name.split(' ')[0]} 👋</h1>
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(true)}
                        className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white hover:bg-club-yellow hover:text-black hover:scale-110 active:scale-90 transition-all duration-300 relative shadow-lg shadow-white/5"
                    >
                        <Bell className="w-6 h-6" />
                        {notifications.some(n => n.isNew) && (
                            <span className="absolute top-2 right-2 w-3 h-3 bg-red-600 rounded-full border-2 border-black animate-bounce"></span>
                        )}
                    </button>
                </div>
            </header>

            {/* ملخص الشكاوى (Hero Section) */}
            <div className="glass rounded-[40px] p-8 mb-10 relative overflow-hidden group border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 w-40 h-40 bg-club-yellow/10 blur-3xl -mr-20 -mt-20 group-hover:bg-club-yellow/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-club-gold/5 blur-3xl -ml-20 -mb-20"></div>

                <p className="text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase mb-4 opacity-70">إحصائيات الشكاوى</p>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-baseline gap-3">
                        <span className="text-7xl font-black text-white tracking-tighter drop-shadow-2xl">{total}</span>
                        <div className="flex flex-col">
                            <span className="text-club-yellow font-black text-sm tracking-widest uppercase">شكوى</span>
                            <span className="text-gray-500 text-[9px] font-bold">إجمالي السجلات</span>
                        </div>
                    </div>
                    <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                        <FileText className="text-club-yellow w-8 h-8 opacity-50" />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => onChangeView('NEW_COMPLAINT')}
                        className="flex-1 bg-club-yellow text-black font-black py-4 rounded-2xl shadow-[0_15px_30px_rgba(255,204,0,0.25)] hover:bg-club-gold hover:translate-y-[-2px] hover:shadow-club-yellow/40 active:scale-95 transition-all duration-300 text-sm flex items-center justify-center gap-2 group/btn"
                    >
                        <span>شكوى جديدة</span>
                        <PlusCircle className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                    </button>
                    {/* تمت إزالة أيقونة الترس غير المستخدمة */}
                </div>
            </div>

            {/* قسم الأخبار والتنبيهات (MAUI Scroll) */}
            <div className="mb-10 px-2 overflow-hidden relative group/news">
                <div className="flex justify-between items-center mb-5 px-1">
                    <h3 className="text-gray-300 text-xs font-black uppercase tracking-[0.3em]">تنبيهات النادي</h3>
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const el = document.getElementById('news-scroll');
                                    if (el) el.scrollBy({ left: 200, behavior: 'smooth' });
                                }}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-club-yellow hover:text-black transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('news-scroll');
                                    if (el) el.scrollBy({ left: -200, behavior: 'smooth' });
                                }}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-club-yellow hover:text-black transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="h-px w-20 bg-gradient-to-l from-club-yellow/50 to-transparent"></div>
                    </div>
                </div>

                {/* MAUI-style Horizontal Scroll with Snap */}
                <div
                    id="news-scroll"
                    className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory scroll-smooth"
                >
                    {announcements.length > 0 ? (
                        announcements.map(ann => (
                            <div key={ann.id} className="min-w-[85%] sm:min-w-[300px] snap-center glass p-6 rounded-[32px] border-white/5 group relative active:scale-[0.98] transition-all duration-300">
                                <div className={`absolute top-0 right-0 w-1 h-12 ${ann.category === 'ALERT' ? 'bg-red-500' : ann.category === 'EVENT' ? 'bg-blue-500' : 'bg-emerald-500'} rounded-bl-full`}></div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2.5 rounded-2xl ${ann.category === 'ALERT' ? 'bg-red-500/10 text-red-500' : ann.category === 'EVENT' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                        <Megaphone className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{ann.category === 'ALERT' ? 'تنبيه عاجل' : ann.category === 'EVENT' ? 'فعالية قادمة' : 'أخبار النادي'}</span>
                                </div>

                                <h4 className="text-white font-black text-sm mb-2 group-hover:text-club-yellow transition-colors">{ann.title}</h4>
                                <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2 mb-4">{ann.content}</p>

                                <div className="flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-[9px] font-bold">{new Date(ann.date).toLocaleDateString('ar-EG')}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full py-10 text-center glass rounded-[32px] border-dashed border-2 border-white/5">
                            <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">لا توجد أخبار جديدة حالياً</p>
                        </div>
                    )}
                </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="mb-12">
                <h3 className="text-gray-300 text-xs font-black uppercase tracking-[0.3em] mb-5 mr-2">حالة المتابعة</h3>
                <div className="grid grid-cols-2 gap-5">
                    <div className="glass p-8 rounded-[32px] border-white/5 flex flex-col items-center justify-center group hover:bg-white/10 hover:border-emerald-500/20 transition-all duration-500 cursor-pointer shadow-xl">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
                            <CheckSquare className="w-7 h-7" />
                        </div>
                        <div className="text-3xl font-black text-white mb-1">{solved}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">مكتملة</div>
                    </div>
                    <div className="glass p-8 rounded-[32px] border-white/5 flex flex-col items-center justify-center group hover:bg-white/10 hover:border-club-yellow/20 transition-all duration-500 cursor-pointer shadow-xl">
                        <div className="w-14 h-14 rounded-2xl bg-club-yellow/10 flex items-center justify-center text-club-yellow mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-club-yellow/10">
                            <Clock className="w-7 h-7" />
                        </div>
                        <div className="text-3xl font-black text-white mb-1">{active}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">جاري العمل</div>
                    </div>
                </div>
            </div>

            {/* قائمة آخر الشكاوى */}
            <div className="mb-6 pr-1 flex justify-between items-center">
                <h3 className="text-gray-300 text-xs font-black uppercase tracking-[0.3em]">سجل النشاطات</h3>
                <button className="text-club-yellow text-[10px] font-black uppercase tracking-widest hover:text-club-gold hover:translate-x-[-4px] transition-all flex items-center gap-2">عرض الكل <ChevronRight className="w-3 h-3 rotate-180" /></button>
            </div>

            <div className="space-y-6">
                {myComplaints.length > 0 ? (
                    myComplaints.map(complaint => (
                        <div key={complaint.id} className="glass rounded-[40px] p-8 border-white/5 hover:bg-white/[0.04] transition-all duration-500 group relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-club-yellow/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-club-yellow group-hover:bg-club-yellow group-hover:text-black transition-all duration-500 shadow-inner">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-base mb-1">{complaint.subject}</h4>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-lg">
                                            {complaint.id}
                                        </span>
                                    </div>
                                </div>
                                <StatusBadge status={complaint.status} />
                            </div>

                            <p className="text-gray-400 text-xs leading-relaxed mb-6 line-clamp-3 opacity-80">
                                {complaint.details}
                            </p>

                            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-3.5 h-3.5 text-club-yellow/50" />
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                        {new Date(complaint.dateCreated).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <PriorityBadge priority={complaint.priority} />
                                    <button
                                        onClick={() => setActiveChatId(activeChatId === complaint.id ? null : complaint.id)}
                                        className="p-2 bg-white/5 rounded-xl text-club-yellow hover:bg-club-yellow hover:text-black transition-all relative"
                                    >
                                        <Send className="w-4 h-4" />
                                        {complaint.messages.filter(m => m.senderRole === UserRole.ADMIN).length > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-black text-[8px] flex items-center justify-center text-white">
                                                {complaint.messages.filter(m => m.senderRole === UserRole.ADMIN).length}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* واجهة المحادثة والتقييم */}
                            {(activeChatId === complaint.id || (complaint.status === ComplaintStatus.SOLVED && !complaint.rating)) && (
                                <div className="mt-6 pt-6 border-t border-white/5 animate-slide-up">
                                    {complaint.status === ComplaintStatus.SOLVED && !complaint.rating ? (
                                        <div className="space-y-4">
                                            <p className="text-[10px] text-club-yellow font-black uppercase tracking-widest text-center">كيف تقيم جودة الحل؟</p>
                                            <div className="flex justify-center gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button key={star} onClick={() => setRating(star)}>
                                                        <Star className={`w-6 h-6 ${rating >= star ? 'text-club-yellow fill-club-yellow' : 'text-gray-600'}`} />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={feedbackText}
                                                onChange={(e) => setFeedbackText(e.target.value)}
                                                placeholder="تعليقك على الحل (اختياري)..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none h-20"
                                            />
                                            <button
                                                onClick={() => { onRateComplaint(complaint.id, rating, feedbackText); setActiveChatId(null); setRating(0); setFeedbackText(''); }}
                                                className="w-full py-3 bg-club-yellow text-black rounded-xl font-black text-[10px] uppercase tracking-widest"
                                            >
                                                إرسال التقييم
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="max-h-40 overflow-y-auto space-y-3 no-scrollbar mb-4">
                                                {complaint.messages?.map(msg => (
                                                    <div key={msg.id} className={`flex flex-col ${msg.senderId === user.id ? 'items-start' : 'items-end'}`}>
                                                        <div className={`p-3 rounded-2xl text-[11px] max-w-[80%] ${msg.senderId === user.id ? 'bg-club-yellow/10 text-club-yellow rounded-tr-none' : 'bg-white/5 text-gray-300 rounded-tl-none'}`}>
                                                            {msg.text}
                                                        </div>
                                                        <span className="text-[8px] text-gray-600 mt-1">{new Date(msg.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={messageText}
                                                    onChange={(e) => setMessageText(e.target.value)}
                                                    placeholder="اكتب رسالتك هنا..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-4 pl-12 text-xs text-white focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => { if (messageText.trim()) { onSendMessage(complaint.id, messageText); setMessageText(''); } }}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-club-yellow text-black rounded-xl"
                                                >
                                                    <Send className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Timeline history={complaint.history} />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 glass rounded-[40px] border-dashed border-2 border-white/5 opacity-50 flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-700 mb-4" />
                        <p className="text-gray-500 font-bold text-sm">لا توجد سجلات حالياً في حسابك</p>
                    </div>
                )}
            </div>

            {/* مودال الإشعارات */}
            {isNotificationsOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={() => setIsNotificationsOpen(false)}
                    ></div>
                    <div className="bg-[#0a0a0b] w-full max-w-md rounded-t-[40px] sm:rounded-[40px] border-t sm:border border-white/10 p-8 shadow-2xl relative z-10 animate-slide-up max-h-[80vh] overflow-y-auto no-scrollbar">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white">مركز الإشعارات</h3>
                            <button
                                onClick={() => setIsNotificationsOpen(false)}
                                className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-5 rounded-[28px] border transition-all ${notif.isNew ? 'bg-club-yellow/10 border-club-yellow/20' : 'bg-white/5 border-white/5'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="text-white text-xs font-black leading-relaxed max-w-[80%]">{notif.title}</h5>
                                            {notif.isNew && <span className="w-2 h-2 bg-club-yellow rounded-full animate-pulse shadow-[0_0_10px_#ffcc00]"></span>}
                                        </div>
                                        <div className="flex items-center gap-2 opacity-50">
                                            <Clock className="w-3 h-3 text-club-yellow" />
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                {new Date(notif.time).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <Bell className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                                    <p className="text-gray-500 text-sm font-bold">لا توجد إشعارات جديدة حالياً</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsNotificationsOpen(false)}
                            className="w-full mt-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            )}

            {/* الملاحة السفلية (Bottom Navigation) */}
            <div className="fixed bottom-6 left-0 w-full px-6 z-50">
                <nav className="max-w-md mx-auto glass rounded-[32px] p-2 flex justify-between items-center shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-white/10 backdrop-blur-3xl">
                    <button
                        onClick={() => onChangeView('DASHBOARD')}
                        className="flex-1 flex flex-col items-center py-3 text-club-yellow relative group"
                    >
                        <div className="p-2.5 rounded-2xl bg-club-yellow/10 group-hover:scale-110 transition-transform">
                            <Home className="w-6 h-6" />
                        </div>
                        <span className="text-[9px] mt-1.5 font-black uppercase tracking-[0.1em]">الرئيسية</span>
                        <div className="absolute -bottom-1 w-1 h-1 bg-club-yellow rounded-full"></div>
                    </button>

                    <div className="relative -mt-16">
                        <button
                            onClick={() => onChangeView('NEW_COMPLAINT')}
                            className="w-18 h-18 bg-club-yellow text-black rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(255,204,0,0.5)] active:scale-90 hover:scale-105 transition-all border-[6px] border-[#000000] z-20"
                        >
                            <PlusCircle className="w-10 h-10" />
                        </button>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex-1 flex flex-col items-center py-3 text-gray-600 hover:text-red-500 transition-all group"
                    >
                        <div className="p-2.5 rounded-2xl group-hover:bg-red-500/10 transition-colors">
                            <LogOut className="w-6 h-6" />
                        </div>
                        <span className="text-[9px] mt-1.5 font-black uppercase tracking-[0.1em]">خروج</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};
