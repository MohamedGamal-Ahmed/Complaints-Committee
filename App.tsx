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
  ComplaintStatus,
  Announcement,
  Department,
  Priority
} from './src/types';
import {
  MOCK_COMPLAINTS,
  MOCK_SUBSCRIPTIONS,
  MOCK_ANNOUNCEMENTS,
  MOCK_DEPARTMENTS,
  MOCK_STAFF
} from './src/constants';
import { authService } from './src/services/AuthService';
import { ComplaintService } from './src/services/ComplaintService';

// استيراد المكونات التي تمت إعادة تصميمها
import { LoginView } from './src/components/LoginView';
import { RegisterView } from './src/components/RegisterView';
import { MemberDashboard } from './src/components/MemberDashboard';
import { NewComplaint } from './src/components/NewComplaint';
import { AdminDashboard } from './src/components/AdminDashboard';
import { StaffDashboard } from './src/components/StaffDashboard';

// تهيئة خدمة الشكاوى بالبيانات التجريبية
const complaintService = new ComplaintService(MOCK_COMPLAINTS);

const App: React.FC = () => {
  // حالة التطبيق (Data States)
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [complaints, setComplaints] = useState<Complaint[]>(complaintService.getAllComplaints());
  const [subscriptions, setSubscriptions] = useState<SubscriptionRequest[]>(MOCK_SUBSCRIPTIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [view, setView] = useState<'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'NEW_COMPLAINT' | 'ADMIN' | 'STAFF'>('LOGIN');

  // حالة إدارة الموظفين والأقسام (مشتركة بين المكونات)
  const [staffList, setStaffList] = useState<User[]>(MOCK_STAFF);
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);

  /**
   * معالجة عملية تسجيل الدخول
   * أولاً نبحث في قائمة الموظفين المسجلين، ثم في الاشتراكات المعتمدة، ثم نستخدم AuthService كفولباك
   */
  const handleLogin = async (role: UserRole, memberId: string, password?: string) => {
    try {
      // 1) البحث في قائمة الموظفين (لتسجيل الدخول كموظف أو مشرف)
      if (role === UserRole.STAFF || role === UserRole.ADMIN) {
        const matchedStaff = staffList.find(s =>
          s.memberId.toLowerCase() === memberId.toLowerCase() && s.role === role
        );
        if (matchedStaff) {
          // التحقق من كلمة المرور
          if (matchedStaff.password && matchedStaff.password !== password) {
            alert('كلمة المرور غير صحيحة');
            return;
          }
          setUser(matchedStaff);
          setView(role === UserRole.ADMIN ? 'ADMIN' : 'STAFF');
          return;
        }
      }

      // 2) البحث في الاشتراكات المعتمدة (لتسجيل الدخول كعضو)
      if (role === UserRole.MEMBER) {
        const approvedSub = subscriptions.find(s =>
          s.memberId === memberId && s.status === 'APPROVED'
        );
        if (approvedSub) {
          const memberUser: User = {
            id: `member-${approvedSub.id}`,
            name: approvedSub.applicantName,
            memberId: approvedSub.memberId,
            role: UserRole.MEMBER,
            photoUrl: `https://picsum.photos/100/100?sig=${approvedSub.id}`,
            phoneNumber: approvedSub.phoneNumber,
            password: approvedSub.password
          };
          if (memberUser.password && memberUser.password !== password) {
            alert('كلمة المرور غير صحيحة');
            return;
          }
          setUser(memberUser);
          setView('DASHBOARD');
          return;
        }
      }

      // 3) الفولباك: المستخدمين التجريبيين الأصليين
      const loggedUser = await authService.login(memberId, password, role);
      setUser(loggedUser);

      if (loggedUser.role === UserRole.ADMIN) {
        setView('ADMIN');
      } else if (loggedUser.role === UserRole.STAFF) {
        setView('STAFF');
      } else {
        setView('DASHBOARD');
      }
    } catch (error) {
      alert('خطأ في تسجيل الدخول. يرجى التأكد من البيانات.');
    }
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
      password: data.password || '',
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
  };

  /**
   * إضافة إعلان جديد (من قبل الأدمن)
   */
  const handleAddAnnouncement = (data: Partial<Announcement>) => {
    const newAnn: Announcement = {
      id: `ANN-${Date.now()}`,
      title: data.title || '',
      content: data.content || '',
      date: new Date().toISOString(),
      category: data.category || 'NEWS',
      isUrgent: data.isUrgent
    };
    setAnnouncements([newAnn, ...announcements]);
  };

  /**
   * حذف إعلان
   */
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  /**
   * إرسال رسالة في المحادثة
   */
  const handleSendMessage = (complaintId: string, text: string) => {
    if (!user) return;
    complaintService.addMessage(complaintId, user, text);
    setComplaints([...complaintService.getAllComplaints()]);
  };

  /**
   * تقييم الشكوى من قبل العضو
   */
  const handleRateComplaint = (complaintId: string, rating: number, feedback: string) => {
    complaintService.addFeedback(complaintId, rating, feedback);
    setComplaints([...complaintService.getAllComplaints()]);
  };

  /**
   * تكليف موظف بمهمة — يحفظ الاسم + القسم
   */
  const handleAssignTask = (id: string, staffName: string, expectedDate?: string) => {
    complaintService.assignTask(id, staffName, expectedDate);
    setComplaints([...complaintService.getAllComplaints()]);
  };

  /**
   * تحديث أولوية الشكوى (من قبل الأدمن)
   */
  const handleUpdatePriority = (id: string, priority: Priority) => {
    complaintService.updatePriority(id, priority);
    setComplaints([...complaintService.getAllComplaints()]);
  };

  // فلترة الشكاوى حسب المستخدم الحالي للعضو
  const memberComplaints = user ? complaints.filter(c => c.userId === user.id) : [];

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
            complaints={memberComplaints}
            announcements={announcements}
            onChangeView={setView}
            onLogout={handleLogout}
            onSendMessage={handleSendMessage}
            onRateComplaint={handleRateComplaint}
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

      {view === 'STAFF' && user && (
        <div className="max-w-md mx-auto">
          <StaffDashboard
            user={user}
            complaints={complaints}
            onUpdateStatus={handleUpdateStatus}
            onSendMessage={handleSendMessage}
            onLogout={handleLogout}
          />
        </div>
      )}

      {view === 'ADMIN' && user && (
        <div className="max-w-6xl mx-auto p-6 transition-all duration-500">
          <AdminDashboard
            user={user}
            complaints={complaints}
            subscriptions={subscriptions}
            announcements={announcements}
            staffList={staffList}
            departments={departments}
            onUpdateStatus={handleUpdateStatus}
            onLogout={handleLogout}
            onManageSubscription={handleManageSubscription}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onSendMessage={handleSendMessage}
            onAssignTask={handleAssignTask}
            onUpdatePriority={handleUpdatePriority}
            onStaffListChange={setStaffList}
            onDepartmentsChange={setDepartments}
          />
        </div>
      )}
    </div>
  );
};

export default App;