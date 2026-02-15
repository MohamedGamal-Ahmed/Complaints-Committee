/**
 * @file src/components/LoginView.tsx
 * @description واجهة تسجيل الدخول المصممة بأسلوب بريميوم للهواتف.
 */

import React, { useState } from 'react';
import { UserRole } from '../types';
import { ClubLogo } from './Common';
import { ChevronDown, Fingerprint, LucideIcon, User as UserIcon, Shield, Briefcase } from 'lucide-react';

interface LoginViewProps {
    onLogin: (role: UserRole, memberId: string, password?: string) => void;
    onRegisterClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegisterClick }) => {
    const [memberId, setMemberId] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.MEMBER);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(role, memberId, password);
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
                    {/* قائمة منسدلة لاختيار الدور */}
                    <div className="relative mb-8">
                        <label className="block text-gray-500 text-[10px] font-black mr-2 mb-2 uppercase tracking-[0.2em]">هوية المستخدم</label>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between text-white hover:bg-white/[0.08] transition-all"
                        >
                            <div className="flex items-center gap-3">
                                {role === UserRole.MEMBER ? <UserIcon className="w-4 h-4 text-club-yellow" /> : role === UserRole.STAFF ? <Briefcase className="w-4 h-4 text-club-yellow" /> : <Shield className="w-4 h-4 text-club-yellow" />}
                                <span className="text-sm font-bold">
                                    {role === UserRole.MEMBER ? 'أنا عضو في النادي' : role === UserRole.STAFF ? 'أنا موظف تنفيذي' : 'إدارة النظام'}
                                </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1c] border border-white/10 rounded-2xl overflow-hidden z-30 shadow-2xl animate-scale-up">
                                {[
                                    { r: UserRole.MEMBER, l: 'أنا عضو في النادي', i: UserIcon },
                                    { r: UserRole.STAFF, l: 'أنا موظف تنفيذي', i: Briefcase },
                                    { r: UserRole.ADMIN, l: 'إدارة النظام', i: Shield }
                                ].map((item) => (
                                    <button
                                        key={item.r}
                                        type="button"
                                        onClick={() => { setRole(item.r); setIsDropdownOpen(false); }}
                                        className={`w-full px-5 py-4 flex items-center gap-4 hover:bg-club-yellow/10 transition-colors text-right ${role === item.r ? 'bg-club-yellow/5 text-club-yellow' : 'text-gray-444'}`}
                                    >
                                        <item.i className="w-4 h-4" />
                                        <span className="text-sm font-bold">{item.l}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-gray-500 text-xs font-bold mr-2 uppercase tracking-wider">
                                {role === UserRole.ADMIN ? 'اسم المشرف' : role === UserRole.STAFF ? 'كود الموظف' : 'رقم العضوية'}
                            </label>
                            <input
                                type="text"
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                placeholder={role === UserRole.ADMIN ? "ADMIN01" : role === UserRole.STAFF ? "STAFF01" : "102030"}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-club-yellow/50 transition-all text-right placeholder:text-gray-700 font-bold"
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

                        <div className="flex gap-4 mt-4">
                            <button
                                type="submit"
                                className="flex-[3] bg-club-yellow hover:bg-club-gold text-black font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(255,204,0,0.2)] active:scale-95 transform"
                            >
                                تسجيل الدخول
                            </button>
                            <button
                                type="button"
                                onClick={() => alert('محاكاة تسجيل الدخول بالبصمة / الوجه...')}
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-club-yellow hover:bg-white/10 transition-all active:scale-95"
                                title="الدخول بالبصمة"
                            >
                                <Fingerprint className="w-7 h-7" />
                            </button>
                        </div>
                    </form>

                    {role === UserRole.MEMBER && (
                        <div className="mt-8 text-center border-t border-white/5 pt-6">
                            <p className="text-gray-500 text-sm">
                                ليس لديك حساب؟ <span onClick={onRegisterClick} className="text-club-yellow cursor-pointer hover:text-club-gold transition-colors font-bold">تسجيل مشترك جديد</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-8 text-gray-700 text-[10px] font-bold tracking-widest uppercase text-center w-full">
                نادي المقاولون العرب - جميع الحقوق محفوظة
                © 2026
                <br />
                By: Eng. Mohamed Gamal
            </div>
        </div>
    );
};
