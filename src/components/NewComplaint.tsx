/**
 * @file src/components/NewComplaint.tsx
 * @description واجهة تقديم شكوى جديدة بتصميم عصري وبسيط.
 */

import React, { useState } from 'react';
import { ChevronRight, Camera, Send } from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintStatus, Priority } from '../types';
import { CATEGORIES_LIST } from '../constants';

interface NewComplaintProps {
    onSubmit: (c: Partial<Complaint>) => void;
    onCancel: () => void;
}

export const NewComplaint: React.FC<NewComplaintProps> = ({ onSubmit, onCancel }) => {
    const [category, setCategory] = useState<ComplaintCategory | ''>('');
    const [subject, setSubject] = useState('');
    const [details, setDetails] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !subject || !details) return;
        onSubmit({
            category: category as ComplaintCategory,
            subject,
            details,
            priority: Priority.MEDIUM,
            status: ComplaintStatus.NEW
        });
    };

    return (
        <div className="animate-slide-up pb-32 font-['Cairo']">
            <header className="flex items-center mb-8 pt-4">
                <button onClick={onCancel} className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-colors group">
                    <ChevronRight className="w-6 h-6 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
                <h1 className="text-2xl font-black text-white mr-6 text-right">تقديم شكوى جديدة</h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="glass rounded-[40px] p-8 border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="space-y-8 relative z-10">
                        {/* اختيار القسم */}
                        <div className="space-y-3">
                            <label className="block text-gray-400 text-xs font-black uppercase tracking-[0.2em] mr-2 text-right">نوع المرفق / القسم *</label>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-club-yellow/50 appearance-none transition-all text-right"
                                >
                                    <option value="" disabled className="bg-black">اختر القسم المعني</option>
                                    {CATEGORIES_LIST.map((cat) => (
                                        <option key={cat} value={cat} className="bg-black">{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <ChevronRight className="w-5 h-5 rotate-90" />
                                </div>
                            </div>
                        </div>

                        {/* الموضوع */}
                        <div className="space-y-3">
                            <label className="block text-gray-400 text-xs font-black uppercase tracking-[0.2em] mr-2 text-right">موضوع الشكوى *</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="لخص المشكلة في كلمات بسيطة"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-club-yellow/50 transition-all text-right placeholder:text-gray-700"
                            />
                        </div>

                        {/* التفاصيل */}
                        <div className="space-y-3">
                            <label className="block text-gray-400 text-xs font-black uppercase tracking-[0.2em] mr-2 text-right">تفاصيل المشكلة *</label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="اكتب ما حدث معك بالتفصيل هنا..."
                                rows={6}
                                maxLength={500}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-club-yellow/50 transition-all text-right placeholder:text-gray-700 resize-none"
                            />
                            <div className="flex justify-start px-2">
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{details.length}/500</span>
                            </div>
                        </div>

                        {/* المرفقات */}
                        <div className="space-y-3">
                            <label className="block text-gray-400 text-xs font-black uppercase tracking-[0.2em] mr-2 text-right">المرفقات (صور / فيديو)</label>
                            <div className="border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] hover:border-club-yellow/50 transition-all cursor-pointer group">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:scale-110 group-hover:text-club-yellow transition-all mb-4">
                                    <Camera className="w-7 h-7" />
                                </div>
                                <p className="text-sm text-gray-500 font-bold">اضغط للتحميل أو اسحب الملفات</p>
                                <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest mt-2">Maximum file size: 10MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-club-yellow hover:bg-club-gold text-black font-black py-5 rounded-2xl shadow-[0_20px_40px_rgba(255,204,0,0.15)] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <Send className="w-5 h-5" />
                    إرسال الشكوى الآن
                </button>
            </form>
        </div>
    );
};
