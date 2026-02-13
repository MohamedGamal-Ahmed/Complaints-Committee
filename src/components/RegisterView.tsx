/**
 * @file src/components/RegisterView.tsx
 * @description واجهة تسجيل عضوية جديدة بأسلوب عصري.
 */

import React, { useState } from 'react';
import {
    ChevronRight,
    User as UserIcon,
    CreditCard,
    Phone,
    Camera,
    CheckCircle
} from 'lucide-react';
import { SubscriptionRequest } from '../types';

interface RegisterViewProps {
    onBack: () => void;
    onSubmit: (data: Partial<SubscriptionRequest>) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onBack, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        memberId: '',
        idImage: null as string | null
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            applicantName: formData.name,
            phoneNumber: formData.phone,
            memberId: formData.memberId,
            idCardImage: formData.idImage || undefined,
            status: 'PENDING',
            dateApplied: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div className="min-h-screen bg-black p-6 flex flex-col items-center justify-center animate-slide-up font-['Cairo']">
            <div className="w-full max-w-md">
                <button onClick={onBack} className="flex items-center text-gray-500 mb-8 hover:text-club-yellow transition-colors group">
                    <ChevronRight className="w-5 h-5 rotate-180 ml-1 group-hover:translate-x-1 transition-transform" /> عودة لتسجيل الدخول
                </button>

                <div className="glass p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-white mb-2">طلب عضوية جديد</h2>
                        <p className="text-xs text-gray-500 leading-relaxed">سيتم مراجعة البيانات من قبل إدارة النادي لتفعيل الحساب</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-gray-500 text-xs font-bold mr-2 uppercase tracking-wider">الاسم رباعي (كما في الكارنية)</label>
                            <div className="relative">
                                <UserIcon className="absolute top-4 right-4 w-5 h-5 text-gray-600" />
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-club-yellow/50 transition-all text-right"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-500 text-xs font-bold mr-2 uppercase tracking-wider">رقم العضوية</label>
                            <div className="relative">
                                <CreditCard className="absolute top-4 right-4 w-5 h-5 text-gray-600" />
                                <input
                                    required
                                    type="text"
                                    value={formData.memberId}
                                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-club-yellow/50 transition-all text-right"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-500 text-xs font-bold mr-2 uppercase tracking-wider">رقم الهاتف</label>
                            <div className="relative">
                                <Phone className="absolute top-4 right-4 w-5 h-5 text-gray-600" />
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-club-yellow/50 transition-all text-right"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-500 text-xs font-bold mr-2 uppercase tracking-wider">صورة الكارنية</label>
                            <div
                                onClick={() => setFormData({ ...formData, idImage: 'uploaded' })}
                                className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${formData.idImage ? 'border-club-yellow bg-club-yellow/5' : 'border-white/10 bg-white/[0.02] hover:border-club-yellow/50 hover:bg-white/[0.04]'}`}
                            >
                                {formData.idImage ? (
                                    <>
                                        <CheckCircle className="w-10 h-10 text-club-yellow mb-2 animate-bounce" />
                                        <p className="text-sm text-club-yellow font-bold">تم رفع الصورة بنجاح</p>
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-10 h-10 text-gray-600 mb-2" />
                                        <p className="text-sm text-gray-500 font-medium">اضغط لرفع صورة الكارنية</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-club-yellow hover:bg-club-gold text-black font-black py-4 rounded-2xl mt-4 shadow-lg shadow-club-yellow/20 active:scale-95 transition-all"
                        >
                            إرسال طلب التفعيل
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
