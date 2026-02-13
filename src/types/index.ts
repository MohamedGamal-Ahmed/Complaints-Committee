/**
 * @file src/types/index.ts
 * @description تعريف جميع الأنواع والواجهات (Interfaces) المستخدمة في التطبيق.
 * يتبع هذا الملف مبدأ الطبقات (Layering) لسهولة الصيانة والتوسع.
 */

/**
 * أدوار المستخدمين في النظام
 */
export enum UserRole {
    MEMBER = 'MEMBER', // عضو النادي
    ADMIN = 'ADMIN'    // مدير النظام
}

/**
 * حالات الشكوى المختلفة
 */
export enum ComplaintStatus {
    NEW = 'جديد',
    UNDER_REVIEW = 'قيد المراجعة',
    IN_PROGRESS = 'قيد التنفيذ',
    SOLVED = 'تم الحل',
    CLOSED = 'مغلق',
    REJECTED = 'مرفوض'
}

/**
 * فئات الشكاوى المتاحة
 */
export enum ComplaintCategory {
    FACILITIES = 'المرافق والقاعات',
    FOOD = 'المطاعم والكافيتريا',
    SPORTS = 'الأنشطة الرياضية',
    EVENTS = 'الفعاليات وخدمات الأعضاء',
    SWIMMING = 'حمامات السباحة',
    CUSTOMER_SERVICE = 'خدمة العملاء',
    MAINTENANCE = 'الصيانة',
    SECURITY = 'الأمن والسلامة',
    SUBSCRIPTION = 'الاشتراكات وشؤون العضوية',
    OTHER = 'أخرى'
}

/**
 * مستويات الأولوية للشكاوى
 */
export enum Priority {
    URGENT = 'عاجل',
    HIGH = 'عالي',
    MEDIUM = 'متوسط',
    LOW = 'منخفض'
}

/**
 * واجهة سجل النشاط للشكوى (Timeline)
 */
export interface ComplaintHistoryLog {
    status: ComplaintStatus;
    date: string;
    note?: string;
    updatedBy: 'USER' | 'ADMIN' | 'SYSTEM';
}

/**
 * واجهة بيانات الشكوى الكاملة
 */
export interface Complaint {
    id: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    category: ComplaintCategory;
    subject: string;
    details: string;
    status: ComplaintStatus;
    priority: Priority;
    dateCreated: string; // صيغة ISO
    lastUpdated: string; // صيغة ISO
    attachments?: string[];
    resolutionNotes?: string;
    history: ComplaintHistoryLog[];
}

/**
 * واجهة بيانات المستخدم
 */
export interface User {
    id: string;
    name: string;
    memberId: string;
    role: UserRole;
    photoUrl: string;
    phoneNumber?: string;
}

/**
 * واجهة طلب الاشتراك الجديد
 */
export interface SubscriptionRequest {
    id: string;
    applicantName: string;
    phoneNumber: string;
    memberId: string;
    idCardImage?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    dateApplied: string;
}
