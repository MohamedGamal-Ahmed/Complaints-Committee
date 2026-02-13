/**
 * @file src/services/ComplaintService.ts
 * @description كلاس لإدارة منطق العمل الخاص بالشكاوى.
 * يتبع مبادئ الـ OOP لتوفير المرونة وسهولة الاختبار.
 */

import {
    Complaint,
    ComplaintStatus,
    ComplaintHistoryLog,
    ComplaintCategory,
    Priority,
    User
} from '../types';

export class ComplaintService {
    private complaints: Complaint[];

    /**
     * إنشاء نسخة جديدة من خدمة الشكاوى
     * @param initialComplaints قائمة الشكاوى الأولية
     */
    constructor(initialComplaints: Complaint[] = []) {
        this.complaints = [...initialComplaints];
    }

    /**
     * الحصول على كل الشكاوى
     */
    getAllComplaints(): Complaint[] {
        return this.complaints;
    }

    /**
     * الحصول على شكاوى مستخدم معين
     * @param userId معرف المستخدم
     */
    getComplaintsByUser(userId: string): Complaint[] {
        return this.complaints.filter(c => c.userId === userId);
    }

    /**
     * إضافة شكوى جديدة للنظام
     * @param user المستخدم صاحب الشكوى
     * @param data بيانات الشكوى
     */
    createComplaint(user: User, data: Partial<Complaint>): Complaint {
        const newComplaint: Complaint = {
            id: `REQ-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userPhoto: user.photoUrl,
            category: data.category || ComplaintCategory.OTHER,
            subject: data.subject || '',
            details: data.details || '',
            status: ComplaintStatus.NEW,
            priority: data.priority || Priority.MEDIUM,
            dateCreated: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            history: [{
                status: ComplaintStatus.NEW,
                date: new Date().toISOString(),
                updatedBy: 'USER'
            }]
        };

        this.complaints = [newComplaint, ...this.complaints];
        return newComplaint;
    }

    /**
     * تحديث حالة شكوى موجودة
     * @param id معرف الشكوى
     * @param status الحالة الجديدة
     * @param note ملاحظة الإدارة
     */
    updateStatus(id: string, status: ComplaintStatus, note?: string): void {
        this.complaints = this.complaints.map(c => {
            if (c.id === id) {
                const historyLog: ComplaintHistoryLog = {
                    status,
                    date: new Date().toISOString(),
                    note: note,
                    updatedBy: 'ADMIN'
                };

                return {
                    ...c,
                    status,
                    resolutionNotes: status === ComplaintStatus.SOLVED ? note : c.resolutionNotes,
                    lastUpdated: new Date().toISOString(),
                    history: [historyLog, ...c.history]
                };
            }
            return c;
        });
    }

    /**
     * ترشيح الشكاوى بناءً على الحالة
     * @param status الحالة المطلوبة
     */
    filterByStatus(status: ComplaintStatus | 'ALL'): Complaint[] {
        if (status === 'ALL') return this.complaints;
        return this.complaints.filter(c => c.status === status);
    }
}

// تصدير نسخة افتراضية لاستخدامها في التطبيق
export const complaintService = new ComplaintService();
