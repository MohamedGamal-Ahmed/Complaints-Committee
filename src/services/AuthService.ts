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
    async login(memberId: string, isAdminMode: boolean): Promise<User> {
        // في الواقع هنا يتم التحقق من قاعدة البيانات، هنا نستخدم بيانات تجريبية
        return new Promise((resolve) => {
            setTimeout(() => {
                if (isAdminMode) {
                    this.currentUser = MOCK_ADMIN;
                } else {
                    // محاكاة إذا كان يحاول الدخول كمدير من واجهة الأعضاء
                    if (memberId.toLowerCase().includes('admin')) {
                        this.currentUser = MOCK_ADMIN;
                    } else {
                        this.currentUser = MOCK_USER;
                    }
                }
                resolve(this.currentUser);
            }, 500); // تأخير بسيط لمحاكاة طلب الشبكة
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
