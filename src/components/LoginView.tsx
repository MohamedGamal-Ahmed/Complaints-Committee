/**
 * @file src/components/LoginView.tsx
 * @description واجهة تسجيل الدخول المصممة بأسلوب بريميوم للهواتف.
 */

import React, { useState } from 'react';
import { UserRole } from '../types';
import { ClubLogo } from './Common';

interface LoginViewProps {
    onLogin: (role: UserRole, memberId: string) => void;
    onRegisterClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegisterClick }) => {
    const [memberId, setMemberId] = useState('');
    const [password, setPassword] = useState('');
    const [isAdminMode, setIsAdminMode] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(isAdminMode ? UserRole.ADMIN : UserRole.MEMBER, memberId);
    };

    return (
        <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 relative overflow-hidden font-['Cairo']">
            {/* عناصر الخلفية المتحركة */}
            <div className="absolute inset-0 opacity-20 transition-opacity duration-1000">
                <img src="/banner.jpg" alt="Banner" className="w-full h-full object-cover scale-110 blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
            </div>

            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-club-yellow/5 blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-club-gold/5 blur-[120px] rounded-full animate-pulse-slow"></div>

            <div className="w-full max-w-sm z-10 animate-fade-in">
                {/* الهيدر والشعار */}
                <div className="flex flex-col items-center mb-10 animate-float">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-club-yellow/20 blur-2xl rounded-full"></div>
                        <ClubLogo className="w-32 h-32 relative drop-shadow-[0_0_20px_rgba(255,204,0,0.3)]" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">نادي المقاولون العرب</h1>
                    <div className="h-1 w-12 bg-club-yellow rounded-full mb-3"></div>
                    <p className="text-gray-400 font-medium text-sm tracking-widest uppercase text-center">بوابة الخدمات الإلكترونية</p>
                </div>

                {/* كارت تسجيل الدخول (Glassmorphism) */}
                <div className="glass p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-club-yellow/5 blur-3xl -mr-16 -mt-16"></div>

                    {/* تبديل وضع الدخول */}
                    <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8">
                        <button
                            onClick={() => setIsAdminMode(false)}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${!isAdminMode ? 'bg-club-yellow text-black shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}
                        >
                            دخول الأعضاء
                        </button>
                        <button
                            onClick={() => setIsAdminMode(true)}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isAdminMode ? 'bg-club-yellow text-black shadow-lg' : 'text-gray-500 hover:text-gray-400'}`}
                        >
                            الإدارة
                        </button>
                    </div>

                    <h2 className="text-xl font-black text-white mb-8 text-center">
                        {isAdminMode ? 'تسجيل دخول المشرفين' : 'تسجيل دخول الأعضاء'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-gray-500 text-xs font-bold mr-2 uppercase tracking-wider">
                                {isAdminMode ? 'اسم المستخدم' : 'رقم العضوية'}
                            </label>
                            <input
                                type="text"
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                placeholder={isAdminMode ? "admin" : "102030"}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-club-yellow/50 transition-all text-right placeholder:text-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-gray-500 text-xs font-bold mr-2 uppercase tracking-wider">كلمة المرور</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-club-yellow/50 transition-all text-right placeholder:text-gray-700"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-club-yellow hover:bg-club-gold text-black font-black py-4 rounded-2xl mt-4 transition-all duration-300 shadow-[0_10px_30px_rgba(255,204,0,0.2)] active:scale-95 transform"
                        >
                            تسجيل الدخول
                        </button>
                    </form>

                    {!isAdminMode && (
                        <div className="mt-8 text-center border-t border-white/5 pt-6">
                            <p className="text-gray-500 text-sm">
                                ليس لديك حساب؟ <span onClick={onRegisterClick} className="text-club-yellow cursor-pointer hover:text-club-gold transition-colors font-bold">تسجيل مشترك جديد</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-8 text-gray-700 text-[10px] font-bold tracking-widest uppercase text-center w-full">
                © 2024 نادي المقاولون العرب - جميع الحقوق محفوظة
            </div>
        </div>
    );
};
