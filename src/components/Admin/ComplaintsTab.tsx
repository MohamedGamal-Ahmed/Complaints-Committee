/**
 * @file src/components/Admin/ComplaintsTab.tsx
 * @description تبويب عرض وإدارة الشكاوى في لوحة الإدارة — مع تحكم مباشر في الحالة والأولوية.
 */

import React, { useState } from 'react';
import {
    Search, Download, MessageCircle, Send, Briefcase, X
} from 'lucide-react';
import {
    User, Complaint, ComplaintStatus, ComplaintCategory, Priority
} from '../../types';
import { StatusBadge, PriorityBadge } from '../Common';
import { CATEGORIES_LIST } from '../../constants';

interface ComplaintsTabProps {
    user: User;
    complaints: Complaint[];
    onUpdateStatus: (id: string, s: ComplaintStatus, notes?: string) => void;
    onUpdatePriority: (id: string, p: Priority) => void;
    onSendMessage: (complaintId: string, text: string) => void;
    onAssignTask: (id: string, staffName: string, expectedDate?: string) => void;
    onOpenAssignModal: (id: string) => void;
    onOpenSolveModal: (id: string) => void;
}

export const ComplaintsTab: React.FC<ComplaintsTabProps> = ({
    user, complaints, onUpdateStatus, onUpdatePriority, onSendMessage, onAssignTask,
    onOpenAssignModal, onOpenSolveModal
}) => {
    const [filter, setFilter] = useState<ComplaintStatus | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'ALL'>('ALL');
    const [dateFilter, setDateFilter] = useState('');
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');

    const filteredComplaints = complaints.filter(c => {
        const matchesStatus = filter === 'ALL' || c.status === filter;
        const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
        const matchesSearch = searchQuery === '' ||
            c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.memberId?.includes(searchQuery) ||
            c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.includes(searchQuery);
        const createdMonth = c.dateCreated ? new Date(c.dateCreated).toISOString().slice(0, 7) : '';
        const matchesDate = dateFilter === '' || createdMonth === dateFilter;
        return matchesStatus && matchesCategory && matchesSearch && matchesDate;
    });

    const downloadReport = () => {
        const headers = ['ID', 'User', 'Category', 'Subject', 'Status', 'Priority', 'Date'];
        const rows = filteredComplaints.map(c => [
            c.id, c.userName, c.category, c.subject, c.status, c.priority, new Date(c.dateCreated).toLocaleDateString()
        ]);
        const csvContent = "sep=;\n\ufeff" + headers.join(";") + "\n"
            + rows.map(e => e.join(";")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `complaints_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* أدوات البحث والفلترة */}
            <div className="glass rounded-[32px] p-6 border-white/5 space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="بحث بالاسم، الكود، الشكوى..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-11 pl-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-club-yellow/30"
                        />
                    </div>
                    <button
                        onClick={downloadReport}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-club-yellow hover:bg-club-yellow hover:text-black transition-all group"
                        title="تصدير إكسيل"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as ComplaintStatus | 'ALL')}
                        className="bg-[#0a0a0b] text-[10px] text-white border border-white/10 rounded-xl py-2.5 px-2 focus:outline-none font-black"
                        style={{ colorScheme: 'dark' }}
                    >
                        <option value="ALL">كل الحالات</option>
                        {Object.values(ComplaintStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as ComplaintCategory | 'ALL')}
                        className="bg-[#0a0a0b] text-[10px] text-white border border-white/10 rounded-xl py-2.5 px-2 focus:outline-none font-black"
                        style={{ colorScheme: 'dark' }}
                    >
                        <option value="ALL">كل الأقسام</option>
                        {Object.values(ComplaintCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <input
                        type="month"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-[#0a0a0b] text-[10px] text-white border border-white/10 rounded-xl py-2 px-2 focus:outline-none font-black"
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between px-2">
                <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest">
                    الشكاوى المفلترة ({filteredComplaints.length})
                </h3>
            </div>

            <div className="space-y-4">
                {filteredComplaints.length > 0 ? filteredComplaints.map(complaint => (
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

                            {complaint.rating && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-sm ${i < complaint.rating! ? 'text-club-yellow' : 'text-gray-800'}`}>★</span>
                                        ))}
                                        <span className="text-[10px] text-gray-500 mr-2 font-bold">تقييم العضو</span>
                                    </div>
                                    {complaint.feedback && (
                                        <p className="text-[10px] text-emerald-400/80 italic font-medium bg-emerald-500/5 p-2 rounded-xl">" {complaint.feedback} "</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* أدوات التحكم الإداري: الحالة + الأولوية */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1 block mr-1">حالة الشكوى</label>
                                <select
                                    value={complaint.status}
                                    onChange={(e) => onUpdateStatus(complaint.id, e.target.value as ComplaintStatus)}
                                    className="w-full bg-[#0a0a0b] text-[10px] text-white border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-club-yellow/30 font-bold"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    {Object.values(ComplaintStatus).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1 block mr-1">الأهمية</label>
                                <select
                                    value={complaint.priority}
                                    onChange={(e) => onUpdatePriority(complaint.id, e.target.value as Priority)}
                                    className="w-full bg-[#0a0a0b] text-[10px] text-white border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-club-yellow/30 font-bold"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    {Object.values(Priority).map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-white/5 rounded-2xl p-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveChatId(activeChatId === complaint.id ? null : complaint.id)}
                                    className="p-2 bg-white/5 rounded-xl text-club-yellow hover:bg-club-yellow hover:text-black transition-all relative"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {complaint.messages.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border border-black">
                                            {complaint.messages.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => onOpenAssignModal(complaint.id)}
                                    className={`p-2 rounded-xl transition-all ${complaint.assignedTo ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-gray-500 hover:text-club-yellow'}`}
                                    title="تكليف بمهمة"
                                >
                                    <Briefcase className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex gap-2 items-center">
                                {complaint.assignedTo && (
                                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[9px] text-emerald-400 font-black">{complaint.assignedTo}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* واجهة المحادثة */}
                        {activeChatId === complaint.id && (
                            <div className="mt-6 pt-6 border-t border-white/5 animate-slide-up space-y-4">
                                <div className="max-h-48 overflow-y-auto space-y-3 no-scrollbar">
                                    {complaint.messages.length > 0 ? complaint.messages.map(msg => (
                                        <div key={msg.id} className={`flex flex-col ${msg.senderId === user.id ? 'items-start' : 'items-end'}`}>
                                            <div className={`p-3 rounded-2xl text-[11px] max-w-[80%] ${msg.senderId === user.id ? 'bg-club-yellow/10 text-club-yellow rounded-tr-none' : 'bg-white/5 text-gray-300 rounded-tl-none'}`}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[8px] text-gray-600 mt-1">{new Date(msg.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-600 text-[10px] py-4 italic">لا توجد رسائل سابقة في هذه الشكوى</p>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="الرد على العضو..."
                                        className="w-full bg-white/10 border border-white/10 rounded-2xl py-3 pr-4 pl-12 text-xs text-white focus:outline-none"
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
                )) : (
                    <div className="text-center py-20 glass rounded-[40px] border-dashed border-2 border-white/5 opacity-50">
                        <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold text-sm">لا توجد شكاوى تطابق معايير البحث</p>
                    </div>
                )}
            </div>
        </div>
    );
};
