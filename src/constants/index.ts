/**
 * @file src/constants/index.ts
 * @description الثوابت والبيانات التجريبية (Mock Data) للنظام.
 */

import {
    User,
    UserRole,
    Complaint,
    ComplaintCategory,
    ComplaintStatus,
    Priority,
    SubscriptionRequest
} from '../types';

/**
 * رابط شعار النادي الرسمي
 */
export const CLUB_LOGO_URL = "/logo.jpg";

/**
 * ألوان الهوية البصرية للنادي (ثيم بريميوم)
 */
export const THEME_COLORS = {
    YELLOW: '#ffcc00',
    GOLD: '#fdb913',
    BLACK: '#000000',
    DARK: '#0a0a0b',
    GLASS: 'rgba(255, 255, 255, 0.03)',
    INPUT: 'rgba(255, 255, 255, 0.05)',
};

/**
 * بيانات مستخدم تجريبي (عضو)
 */
export const MOCK_USER: User = {
    id: 'u1',
    name: 'أحمد محمد',
    memberId: '102030',
    phoneNumber: '01000000001',
    role: UserRole.MEMBER,
    photoUrl: 'https://picsum.photos/100/100'
};

/**
 * بيانات مسؤول تجريبي (مدير)
 */
export const MOCK_ADMIN: User = {
    id: 'a1',
    name: 'مدير النظام',
    memberId: 'ADMIN01',
    role: UserRole.ADMIN,
    photoUrl: 'https://picsum.photos/100/100?grayscale'
};

/**
 * قائمة الشكاوى التجريبية
 */
export const MOCK_COMPLAINTS: Complaint[] = [
    {
        id: 'REQ-2023-089',
        userId: 'u2',
        userName: 'أحمد حسن',
        category: ComplaintCategory.SPORTS,
        subject: 'عطل في تكييف القاعة الرئيسية',
        details: 'القاعة بحاجة لصيانة عاجلة قبل الحفل السنوي، التكييف لا يعمل بكفاءة.',
        status: ComplaintStatus.UNDER_REVIEW,
        priority: Priority.HIGH,
        dateCreated: '2023-10-12T10:00:00',
        lastUpdated: '2023-10-12T12:00:00',
        history: [
            { status: ComplaintStatus.NEW, date: '2023-10-12T10:00:00', updatedBy: 'USER' },
            { status: ComplaintStatus.UNDER_REVIEW, date: '2023-10-12T12:00:00', note: 'تم تحويل الطلب للإدارة الهندسية', updatedBy: 'ADMIN' }
        ]
    },
    {
        id: 'REQ-2023-084',
        userId: 'u1',
        userName: 'أحمد محمد',
        category: ComplaintCategory.SWIMMING,
        subject: 'سوء نظافة حمام السباحة',
        details: 'يرجى متابعة شركات النظافة، المياه ليست نقية بما يكفي اليوم.',
        status: ComplaintStatus.SOLVED,
        priority: Priority.MEDIUM,
        dateCreated: '2023-10-05T09:30:00',
        lastUpdated: '2023-10-07T14:00:00',
        resolutionNotes: 'تم توجيه شركة النظافة وتغيير الفلاتر بالكامل، وتمت المراجعة من قبل مشرف النشاط الرياضي.',
        history: [
            { status: ComplaintStatus.NEW, date: '2023-10-05T09:30:00', updatedBy: 'USER' },
            { status: ComplaintStatus.IN_PROGRESS, date: '2023-10-06T10:00:00', note: 'جار العمل على التنظيف', updatedBy: 'ADMIN' },
            { status: ComplaintStatus.SOLVED, date: '2023-10-07T14:00:00', note: 'تم الانتهاء', updatedBy: 'ADMIN' }
        ]
    }
];

/**
 * قائمة طلبات الاشتراك التجريبية
 */
export const MOCK_SUBSCRIPTIONS: SubscriptionRequest[] = [
    {
        id: 'SUB-101',
        applicantName: 'خالد إبراهيم',
        memberId: '505020',
        phoneNumber: '01234567890',
        status: 'PENDING',
        dateApplied: '2023-10-20',
        idCardImage: 'https://mostaql.com/portfolio/2116553-%D9%83%D8%A7%D8%B1%D9%86%D9%8A%D9%87-%D8%B9%D8%B6%D9%88%D9%8A%D8%A9'
    }
];

export const CATEGORIES_LIST = Object.values(ComplaintCategory);
