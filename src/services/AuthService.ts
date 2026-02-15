/**
 * @file src/services/AuthService.ts
 * @description كلاس مسؤول عن إدارة هوية المستخدم وعمليات تسجيل الدخول.
 */

import { User, UserRole } from '../types';
import { MOCK_USER, MOCK_ADMIN } from '../constants';

export class AuthService {
    private currentUser: User | null = null;

    /**
     * محاكاة لعملية تسجيل الدخول
     * @param memberId رقم العضوية أو اسم المستخدم
     * @param isAdminMode هل الدخول كمدير؟
     */
    async login(memberId: string, password?: string, role: UserRole = UserRole.MEMBER): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // محاكاة التحقق من البيانات
                if (role === UserRole.ADMIN && memberId === 'ADMIN01') {
                    this.currentUser = { ...MOCK_ADMIN };
                    resolve(this.currentUser);
                } else if (role === UserRole.STAFF && memberId === 'STAFF01') {
                    // إضافة موظف تجريبي في الخدمة
                    this.currentUser = {
                        id: 's1',
                        name: 'فني الصيانة (تجريبي)',
                        memberId: 'STAFF01',
                        role: UserRole.STAFF,
                        photoUrl: 'https://picsum.photos/100/100?tech'
                    };
                    resolve(this.currentUser);
                } else if (role === UserRole.MEMBER && memberId === '102030') {
                    this.currentUser = { ...MOCK_USER };
                    resolve(this.currentUser);
                } else {
                    // في حالة عدم المطابقة للمستخدمين التجريبيين
                    // ننشئ مستخدم جديد بـ ID فريد حتى لا يرى شكاوى مستخدمين آخرين
                    const uniqueId = `user-${memberId}-${Date.now()}`;
                    this.currentUser = {
                        id: uniqueId,
                        memberId,
                        name: role === UserRole.ADMIN ? 'مشرف تجريبي' : role === UserRole.STAFF ? 'موظف تجريبي' : memberId,
                        role: role,
                        photoUrl: `https://picsum.photos/100/100?sig=${Date.now()}`
                    };
                    resolve(this.currentUser);
                }
            }, 500);
        });
    }

    /**
     * تسجيل الخروج ومسح بيانات الجلسة
     */
    logout(): void {
        this.currentUser = null;
    }

    /**
     * الحصول على المستخدم الحالي
     */
    getCurrentUser(): User | null {
        return this.currentUser;
    }

    /**
     * هل المستخدم الحالي مدير؟
     */
    isAdmin(): boolean {
        return this.currentUser?.role === UserRole.ADMIN;
    }
}

export const authService = new AuthService();
