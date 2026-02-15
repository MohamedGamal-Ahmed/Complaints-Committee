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
            memberId: user.memberId, // حفظ رقم العضوية للبحث
            userPhone: user.phoneNumber, // حفظ رقم التليفون للتواصل
            history: [{
                status: ComplaintStatus.NEW,
                date: new Date().toISOString(),
                updatedBy: 'USER'
            }],
            messages: [] // تهيئة مصفوفة المحادثة
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
     * إرسال رسالة في المحادثة
     */
    addMessage(id: string, sender: User, text: string): void {
        this.complaints = this.complaints.map(c => {
            if (c.id === id) {
                const newMessage = {
                    id: `MSG-${Date.now()}`,
                    senderId: sender.id,
                    senderName: sender.name,
                    senderRole: sender.role,
                    text,
                    date: new Date().toISOString()
                };
                return {
                    ...c,
                    messages: [...c.messages, newMessage],
                    lastUpdated: new Date().toISOString()
                };
            }
            return c;
        });
    }

    /**
     * تقييم الشكوى بعد الحل
     */
    addFeedback(id: string, rating: number, feedback?: string): void {
        this.complaints = this.complaints.map(c => {
            if (c.id === id) {
                return { ...c, rating, feedback, lastUpdated: new Date().toISOString() };
            }
            return c;
        });
    }

    /**
     * تكليف موظف بمهمة داخلية
     */
    assignTask(id: string, staffName: string, expectedDate?: string): void {
        this.complaints = this.complaints.map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    assignedTo: staffName,
                    assignmentDate: new Date().toISOString(),
                    expectedResolution: expectedDate,
                    status: ComplaintStatus.IN_PROGRESS, // تغيير الحالة تلقائياً
                    lastUpdated: new Date().toISOString()
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

    /**
     * تحديث أولوية الشكوى
     */
    updatePriority(id: string, priority: Priority): void {
        this.complaints = this.complaints.map(c => {
            if (c.id === id) {
                return { ...c, priority, lastUpdated: new Date().toISOString() };
            }
            return c;
        });
    }
}

// تصدير نسخة افتراضية لاستخدامها في التطبيق
export const complaintService = new ComplaintService();
