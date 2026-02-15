/**
 * @file src/components/Admin/AnnouncementsTab.tsx
 * @description تبويب الإعلانات والأخبار في لوحة الإدارة.
 */

import React, { useState } from 'react';
import { Plus, Trash2, Megaphone, X } from 'lucide-react';
import { Announcement } from '../../types';

interface AnnouncementsTabProps {
    announcements: Announcement[];
    onAddAnnouncement: (data: Partial<Announcement>) => void;
    onDeleteAnnouncement: (id: string) => void;
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({
    announcements, onAddAnnouncement, onDeleteAnnouncement
}) => {
    const [isAddingNews, setIsAddingNews] = useState(false);
    const [newNews, setNewNews] = useState<Partial<Announcement>>({
        title: '', content: '', category: 'NEWS', isUrgent: false
    });

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest">أخبار وتنبيهات النادي</h3>
                <button
                    onClick={() => setIsAddingNews(true)}
                    className="p-2.5 bg-club-yellow text-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-club-yellow/10 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <div className="text-center py-20 glass rounded-[40px] border-dashed border-2 border-white/5">
                        <p className="text-gray-500 font-bold text-sm">لا توجد أخبار حالياً</p>
                    </div>
                ) : (
                    announcements.map(ann => (
                        <div key={ann.id} className="glass rounded-[32px] p-6 border-white/5 relative group overflow-hidden">
                            {ann.isUrgent && <div className="absolute top-0 right-0 w-1 h-full bg-red-500"></div>}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ann.category === 'ALERT' ? 'bg-red-500/10 text-red-400' : ann.category === 'EVENT' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                        <Megaphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-sm">{ann.title}</h4>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{new Date(ann.date).toLocaleDateString('ar-EG')}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDeleteAnnouncement(ann.id)}
                                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2">{ann.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* مودال إضافة خبر */}
            {isAddingNews && (
                <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in font-['Cairo']">
                    <div className="glass w-full max-w-sm rounded-[40px] border-white/10 p-8 shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white">إضافة تنبيه جديد</h3>
                            <button onClick={() => setIsAddingNews(false)} className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest mr-2">العنوان</label>
                                <input
                                    type="text"
                                    value={newNews.title}
                                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                                    placeholder="مثلاً: صيانة حمام السباحة"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-club-yellow/30 text-right text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest mr-2">التصنيف</label>
                                <div className="flex gap-2">
                                    {(['NEWS', 'ALERT', 'EVENT'] as const).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setNewNews({ ...newNews, category: cat })}
                                            className={`flex-1 py-2 rounded-xl text-[9px] font-black border transition-all ${newNews.category === cat ? 'bg-club-yellow text-black border-club-yellow' : 'bg-white/5 text-gray-500 border-white/10'}`}
                                        >
                                            {cat === 'NEWS' ? 'خبر' : cat === 'ALERT' ? 'تنبيه' : 'فعالية'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest mr-2">التفاصيل</label>
                                <textarea
                                    value={newNews.content}
                                    onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                                    placeholder="اكتب تفاصيل الإعلان هنا..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white h-32 resize-none focus:outline-none focus:ring-1 focus:ring-club-yellow/30 text-right text-sm"
                                />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div
                                    onClick={() => setNewNews({ ...newNews, isUrgent: !newNews.isUrgent })}
                                    className={`w-10 h-6 rounded-full transition-all relative ${newNews.isUrgent ? 'bg-red-600' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newNews.isUrgent ? 'right-5' : 'right-1'}`}></div>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${newNews.isUrgent ? 'text-red-500' : 'text-gray-500'}`}>إعلان عاجل</span>
                            </label>

                            <button
                                onClick={() => { onAddAnnouncement(newNews); setIsAddingNews(false); setNewNews({ title: '', content: '', category: 'NEWS', isUrgent: false }); }}
                                className="w-full bg-club-yellow text-black font-black py-4 rounded-2xl shadow-xl shadow-club-yellow/10 hover:bg-club-gold transition-all mt-4"
                            >
                                نشر الإعلان للجميع
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
