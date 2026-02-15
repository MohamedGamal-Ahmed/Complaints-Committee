/**
 * @file src/components/AdminDashboard.tsx
 * @description لوحة تحكم المسؤول (الأدمن) - منظم رئيسي يعتمد على المكونات الفرعية.
 */

import React, { useState } from 'react';
import { LogOut, X, Calendar } from 'lucide-react';
import {
    User,
    Announcement,
    Complaint,
    SubscriptionRequest,
    ComplaintStatus,
    Department,
    Priority,
} from '../types';

// المكونات الفرعية المقسمة
import { AnalyticsTab } from './Admin/AnalyticsTab';
import { ComplaintsTab } from './Admin/ComplaintsTab';
import { AnnouncementsTab } from './Admin/AnnouncementsTab';
import { UsersTab } from './Admin/UsersTab';
import { SubscriptionsTab } from './Admin/SubscriptionsTab';

interface AdminDashboardProps {
    user: User;
    complaints: Complaint[];
    subscriptions: SubscriptionRequest[];
    announcements: Announcement[];
    staffList: User[];
    departments: Department[];
    onUpdateStatus: (id: string, s: ComplaintStatus, notes?: string) => void;
    onLogout: () => void;
    onManageSubscription: (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
    onAddAnnouncement: (data: Partial<Announcement>) => void;
    onDeleteAnnouncement: (id: string) => void;
    onSendMessage: (complaintId: string, text: string) => void;
    onAssignTask: (id: string, staffName: string, expectedDate?: string) => void;
    onUpdatePriority: (id: string, priority: Priority) => void;
    onStaffListChange: (list: User[]) => void;
    onDepartmentsChange: (deps: Department[]) => void;
}

type TabKey = 'ANALYTICS' | 'DASHBOARD' | 'SUBSCRIPTIONS' | 'ANNOUNCEMENTS' | 'USERS';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    user,
    complaints,
    subscriptions,
    announcements,
    staffList,
    departments,
    onUpdateStatus,
    onLogout,
    onManageSubscription,
    onAddAnnouncement,
    onDeleteAnnouncement,
    onSendMessage,
    onAssignTask,
    onUpdatePriority,
    onStaffListChange,
    onDepartmentsChange
}) => {
    const [activeTab, setActiveTab] = useState<TabKey>('DASHBOARD');

    // حالة مودال التكليف والحل
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [selectedStaffId, setSelectedStaffId] = useState('');
    const [expectedDate, setExpectedDate] = useState('');
    const [solvingId, setSolvingId] = useState<string | null>(null);
    const [resolutionNote, setResolutionNote] = useState('');

    const TAB_LABELS: Record<TabKey, string> = {
        ANALYTICS: 'التحليلات',
        DASHBOARD: 'الشكاوى',
        SUBSCRIPTIONS: 'الاشتراكات',
        ANNOUNCEMENTS: 'الأخبار',
        USERS: 'المستخدمين'
    };

    // إيجاد الموظف المختار
    const selectedStaff = staffList.find(s => s.id === selectedStaffId);

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

            {/* التبويبات */}
            <div className="flex p-1 bg-white/5 rounded-[24px] mb-8 border border-white/5 overflow-x-auto no-scrollbar">
                {(Object.keys(TAB_LABELS) as TabKey[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`min-w-[80px] flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-[18px] transition-all duration-300 ${activeTab === tab ? 'bg-club-yellow text-black shadow-lg scale-100' : 'text-gray-500 hover:text-gray-400 scale-95'}`}
                    >
                        {TAB_LABELS[tab]}
                    </button>
                ))}
            </div>

            {/* محتوى التبويبات */}
            {activeTab === 'ANALYTICS' && <AnalyticsTab complaints={complaints} />}

            {activeTab === 'DASHBOARD' && (
                <ComplaintsTab
                    user={user}
                    complaints={complaints}
                    onUpdateStatus={onUpdateStatus}
                    onUpdatePriority={onUpdatePriority}
                    onSendMessage={onSendMessage}
                    onAssignTask={onAssignTask}
                    onOpenAssignModal={(id) => setAssigningId(id)}
                    onOpenSolveModal={(id) => { setSolvingId(id); setResolutionNote(''); }}
                />
            )}

            {activeTab === 'SUBSCRIPTIONS' && (
                <SubscriptionsTab
                    subscriptions={subscriptions}
                    onManageSubscription={onManageSubscription}
                />
            )}

            {activeTab === 'ANNOUNCEMENTS' && (
                <AnnouncementsTab
                    announcements={announcements}
                    onAddAnnouncement={onAddAnnouncement}
                    onDeleteAnnouncement={onDeleteAnnouncement}
                />
            )}

            {activeTab === 'USERS' && (
                <UsersTab
                    staffList={staffList}
                    departments={departments}
                    onStaffListChange={onStaffListChange}
                    onDepartmentsChange={onDepartmentsChange}
                />
            )}

            {/* مودال تكليف مهمة — قائمة منسدلة بالموظفين */}
            {assigningId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setAssigningId(null)}></div>
                    <div className="glass w-full max-w-sm rounded-[40px] p-8 border-white/10 relative animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-black text-lg">تكليف بمهمة داخلية</h3>
                            <button onClick={() => setAssigningId(null)} className="p-2 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="space-y-4">
                            {/* قائمة منسدلة بالموظفين */}
                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block mr-2">اختر الموظف المسؤول</label>
                                <select
                                    value={selectedStaffId}
                                    onChange={(e) => setSelectedStaffId(e.target.value)}
                                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-club-yellow/30 font-bold appearance-none"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    <option value="">— اختر موظف —</option>
                                    {staffList.filter(s => s.role !== 'MEMBER' as any).map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} — {s.department || 'بدون قسم'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* معاينة الموظف المختار */}
                            {selectedStaff && (
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
                                    <img src={selectedStaff.photoUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-club-yellow/20" />
                                    <div>
                                        <p className="text-white text-xs font-black">{selectedStaff.name}</p>
                                        <p className="text-[9px] text-gray-500 font-bold">{selectedStaff.department} • {selectedStaff.role}</p>
                                    </div>
                                </div>
                            )}

                            {/* وقت التنفيذ المتوقع */}
                            <div>
                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block mr-2">وقت التنفيذ المتوقع</label>
                                <div className="relative">
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-club-yellow/50 pointer-events-none" />
                                    <input
                                        type="date"
                                        value={expectedDate}
                                        onChange={(e) => setExpectedDate(e.target.value)}
                                        className="w-full bg-[#0a0a0b] border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-club-yellow/30"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (selectedStaff) {
                                        const displayName = `${selectedStaff.name} - ${selectedStaff.department || ''}`;
                                        onAssignTask(assigningId, displayName, expectedDate);
                                        setAssigningId(null);
                                        setSelectedStaffId('');
                                        setExpectedDate('');
                                    }
                                }}
                                disabled={!selectedStaffId}
                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all mt-4 ${selectedStaffId ? 'bg-club-yellow text-black shadow-lg shadow-club-yellow/20 hover:scale-[1.02] active:scale-95' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                            >
                                تأكيد التكليف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال الحل */}
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
        </div>
    );
};
