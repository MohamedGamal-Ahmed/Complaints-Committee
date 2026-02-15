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
    ADMIN = 'ADMIN',    // مدير النظام
    STAFF = 'STAFF'     // موظف
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
 * واجهة بيانات القسم
 */
export interface Department {
    id: string;
    name: string;
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
 * واجهة رسائل المحادثة داخل الشكوى
 */
export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    text: string;
    date: string;
    attachments?: string[];
}

/**
 * واجهة بيانات الشكوى الكاملة
 */
export interface Complaint {
    id: string;
    userId: string;
    userName: string;
    memberId?: string; // أضفنا رقم العضوية هنا للبحث
    userPhone?: string; // رقم تليفون العضو للتواصل
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
    messages: ChatMessage[]; // المحادثة المباشرة
    rating?: number; // تقييم 1-5
    feedback?: string; // تعليق العضو على الحل
    assignedTo?: string; // الموظف المكلف بالمهمة (داخلي)
    assignmentDate?: string; // تاريخ التكليف
    expectedResolution?: string; // التاريخ المتوقع للحل
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
    password?: string;
    department?: string; // اسم القسم المنتمي إليه (للموظفين)
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
    password?: string; // كلمة المرور التي اختارها المستخدم
}

/**
 * واجهة الإعلانات والتنبيهات
 */
export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
    category: 'NEWS' | 'ALERT' | 'EVENT';
    isUrgent?: boolean;
}
