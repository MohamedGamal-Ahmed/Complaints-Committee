/**
 * @file src/components/StaffDashboard.tsx
 * @description لوحة تحكم الموظفين/الفنيين لمتابعة المهام المكلفة إليهم.
 */


import {
    LogOut,
    CheckCircle,
    Clock,
    AlertCircle,
    User as UserIcon,
    Briefcase,
    Phone,
    MessageCircle,
    Send
} from 'lucide-react';
import React, { useState } from 'react';
import { Complaint, ComplaintStatus, User } from '../types';

interface StaffDashboardProps {
    user: User;
    complaints: Complaint[];
    onUpdateStatus: (id: string, status: ComplaintStatus, notes?: string) => void;
    onSendMessage: (complaintId: string, text: string) => void;
    onLogout: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
    user,
    complaints,
    onUpdateStatus,
    onSendMessage,
    onLogout
}) => {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');
    // تصفية الشكاوى المكلفة لهذا الموظف — البحث بالاسم داخل حقل assignedTo
    const myTasks = complaints.filter(c =>
        c.assignedTo && (
            c.assignedTo === user.name ||
            c.assignedTo.includes(user.name) ||
            c.assignedTo === 'فني الصيانة (تجريبي)'
        )
    );

    return (
        <div className="min-h-screen bg-black font-['Cairo'] text-white pb-20 animate-fade-in">
            {/* Header */}
            <div className="glass p-6 rounded-b-[40px] border-white/10 mb-8 sticky top-0 z-20">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-club-yellow/10 border border-club-yellow/20 flex items-center justify-center text-club-yellow">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white">لوحة مهام التنفيذ</h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">أهلاً، {user.name}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-md mx-auto px-6 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-gray-500 text-xs font-black uppercase tracking-widest">مهامي الحالية ({myTasks.length})</h2>
                </div>

                {myTasks.length > 0 ? myTasks.map(task => (
                    <div key={task.id} className="glass rounded-[32px] p-6 border-white/5 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-club-yellow/5 blur-3xl -mr-12 -mt-12"></div>

                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] text-gray-500 font-black">#{task.id.split('-').pop()}</span>
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${task.status === ComplaintStatus.SOLVED ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' :
                                'border-club-yellow/50 text-club-yellow bg-club-yellow/5'
                                }`}>
                                {task.status}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-white font-black text-sm mb-2">{task.subject}</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">{task.details}</p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 mb-6 space-y-3 border border-white/5">
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-[11px] text-gray-300">العضو: {task.userName}</span>
                            </div>
                            {task.userPhone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <a href={`tel:${task.userPhone}`} className="text-[11px] text-club-yellow font-bold hover:underline" dir="ltr">
                                        {task.userPhone}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-[11px] text-gray-300">التاريخ المتوقع: {task.expectedResolution || 'غير محدد'}</span>
                            </div>
                        </div>

                        {/* أزرار الإجراءات */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setActiveChatId(activeChatId === task.id ? null : task.id)}
                                className="flex-1 py-3 bg-white/5 border border-white/10 text-club-yellow rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-club-yellow/10 transition-all flex items-center justify-center gap-2 relative"
                            >
                                <MessageCircle className="w-4 h-4" />
                                مراسلة العضو
                                {task.messages.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-black">
                                        {task.messages.length}
                                    </span>
                                )}
                            </button>
                            {task.status !== ComplaintStatus.SOLVED && (
                                <button
                                    onClick={() => onUpdateStatus(task.id, ComplaintStatus.SOLVED, 'تم التنفيذ والإصلاح من قبل الفني المختص.')}
                                    className="flex-1 py-3 bg-emerald-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    إتمام المهمة
                                </button>
                            )}
                        </div>

                        {/* واجهة المحادثة */}
                        {activeChatId === task.id && (
                            <div className="mt-4 pt-4 border-t border-white/5 animate-slide-up space-y-3">
                                <div className="max-h-48 overflow-y-auto space-y-3 no-scrollbar">
                                    {task.messages.length > 0 ? task.messages.map(msg => (
                                        <div key={msg.id} className={`flex flex-col ${msg.senderId === user.id ? 'items-start' : 'items-end'}`}>
                                            <div className={`p-3 rounded-2xl text-[11px] max-w-[80%] ${msg.senderId === user.id
                                                ? 'bg-club-yellow/10 text-club-yellow rounded-tr-none'
                                                : 'bg-white/5 text-gray-300 rounded-tl-none'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[8px] text-gray-600 mt-1">
                                                {msg.senderName} · {new Date(msg.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-600 text-[10px] py-4 italic">لا توجد رسائل سابقة</p>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && messageText.trim()) { onSendMessage(task.id, messageText); setMessageText(''); } }}
                                        placeholder="اكتب رسالة للعضو..."
                                        className="w-full bg-white/10 border border-white/10 rounded-2xl py-3 pr-4 pl-12 text-xs text-white focus:outline-none focus:ring-1 focus:ring-club-yellow/30"
                                    />
                                    <button
                                        onClick={() => { if (messageText.trim()) { onSendMessage(task.id, messageText); setMessageText(''); } }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-club-yellow text-black rounded-xl"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-20 glass rounded-[40px] border-dashed border-2 border-white/5 opacity-40">
                        <AlertCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold text-sm">لا توجد مهام مكلفة إليك حالياً</p>
                    </div>
                )}
            </div>
        </div>
    );
};
