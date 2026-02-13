/**
 * @file App.tsx
 * @description المكون الرئيسي للتطبيق. يعمل كمنظم (Orchestrator) للمكونات والخدمات.
 * تم تقليل حجم الكود هنا بشكل كبير وتوزيعه على خدمات ومكونات مستقلة لسهولة التوسع.
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Complaint,
  SubscriptionRequest,
  UserRole,
  ComplaintStatus
} from './src/types';
import {
  MOCK_COMPLAINTS,
  MOCK_SUBSCRIPTIONS
} from './src/constants';
import { authService } from './src/services/AuthService';
import { ComplaintService } from './src/services/ComplaintService';

// استيراد المكونات التي تمت إعادة تصميمها
import { LoginView } from './src/components/LoginView';
import { RegisterView } from './src/components/RegisterView';
import { MemberDashboard } from './src/components/MemberDashboard';
import { NewComplaint } from './src/components/NewComplaint';
import { AdminDashboard } from './src/components/AdminDashboard';

// تهيئة خدمة الشكاوى بالبيانات التجريبية
const complaintService = new ComplaintService(MOCK_COMPLAINTS);

const App: React.FC = () => {
  // حالة التطبيق (Data States)
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [complaints, setComplaints] = useState<Complaint[]>(complaintService.getAllComplaints());
  const [subscriptions, setSubscriptions] = useState<SubscriptionRequest[]>(MOCK_SUBSCRIPTIONS);
  const [view, setView] = useState<'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'NEW_COMPLAINT' | 'ADMIN'>('LOGIN');

  /**
   * معالجة عملية تسجيل الدخول
   */
  const handleLogin = async (role: UserRole, memberId: string) => {
    const loggedUser = await authService.login(memberId, role === UserRole.ADMIN);
    setUser(loggedUser);
    setView(loggedUser.role === UserRole.ADMIN ? 'ADMIN' : 'DASHBOARD');
  };

  /**
   * تسجيل الخروج
   */
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('LOGIN');
  };

  /**
   * تقديم شكوى جديدة
   */
  const handleSubmitComplaint = (data: Partial<Complaint>) => {
    if (!user) return;
    const newComplaint = complaintService.createComplaint(user, data);
    setComplaints([newComplaint, ...complaints]);
    setView('DASHBOARD');
  };

  /**
   * تحديث حالة الشكوى (للمسؤول)
   */
  const handleUpdateStatus = (id: string, status: ComplaintStatus, notes?: string) => {
    complaintService.updateStatus(id, status, notes);
    setComplaints([...complaintService.getAllComplaints()]);
  };

  /**
   * طلب تسجيل جديد
   */
  const handleRegister = (data: Partial<SubscriptionRequest>) => {
    const newRequest: SubscriptionRequest = {
      id: `SUB-${Date.now()}`,
      applicantName: data.applicantName || '',
      memberId: data.memberId || '',
      phoneNumber: data.phoneNumber || '',
      status: 'PENDING',
      dateApplied: new Date().toISOString().split('T')[0],
      idCardImage: data.idCardImage
    };
    setSubscriptions([newRequest, ...subscriptions]);
    alert('تم إرسال طلبك بنجاح، سيتم مراجعته وتفعيل الحساب قريباً.');
    setView('LOGIN');
  };

  /**
   * قبول أو رفض طلبات العضوية
   */
  const handleManageSubscription = (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    setSubscriptions(prev => prev.map(s =>
      s.id === id ? { ...s, status, rejectionReason: reason } : s
    ));
    // في الواقع، هنا يتم إنشاء مستخدم جديد إذا تمت الموافقة
  };

  return (
    <div className="min-h-screen bg-[#000000] font-['Cairo'] text-white select-none overflow-x-hidden" dir="rtl">
      {/* عرض الواجهة المناسبة بناءً على الحالة */}
      {view === 'LOGIN' && (
        <LoginView onLogin={handleLogin} onRegisterClick={() => setView('REGISTER')} />
      )}

      {view === 'REGISTER' && (
        <RegisterView onBack={() => setView('LOGIN')} onSubmit={handleRegister} />
      )}

      {view === 'DASHBOARD' && user && (
        <div className="max-w-md mx-auto p-6">
          <MemberDashboard
            user={user}
            complaints={complaints}
            onChangeView={setView}
            onLogout={handleLogout}
          />
        </div>
      )}

      {view === 'NEW_COMPLAINT' && (
        <div className="max-w-md mx-auto p-6">
          <NewComplaint
            onSubmit={handleSubmitComplaint}
            onCancel={() => setView('DASHBOARD')}
          />
        </div>
      )}

      {view === 'ADMIN' && (
        <div className="max-w-md mx-auto p-6">
          <AdminDashboard
            complaints={complaints}
            subscriptions={subscriptions}
            onUpdateStatus={handleUpdateStatus}
            onLogout={handleLogout}
            onManageSubscription={handleManageSubscription}
          />
        </div>
      )}
    </div>
  );
};

export default App;