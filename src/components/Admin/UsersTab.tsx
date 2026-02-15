/**
 * @file src/components/Admin/UsersTab.tsx
 * @description تبويب إدارة المستخدمين (الموظفين والمشرفين) مع الأقسام وكلمات المرور.
 */

import React, { useState } from 'react';
import { UserPlus, Trash2, Plus, X } from 'lucide-react';
import { User, UserRole, Department } from '../../types';

interface UsersTabProps {
    staffList: User[];
    departments: Department[];
    onStaffListChange: (list: User[]) => void;
    onDepartmentsChange: (deps: Department[]) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
    staffList, departments, onStaffListChange, onDepartmentsChange
}) => {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
    const [newDeptName, setNewDeptName] = useState('');
    const [newUser, setNewUser] = useState({
        name: '',
        password: '',
        department: '',
        role: UserRole.STAFF as UserRole
    });

    const handleAddUser = () => {
        if (newUser.name && newUser.password && newUser.department) {
            onStaffListChange([...staffList, {
                id: `u-${Date.now()}`,
                name: newUser.name,
                memberId: `${newUser.role === UserRole.ADMIN ? 'ADMIN' : 'STAFF'}${String(staffList.length + 1).padStart(2, '0')}`,
                role: newUser.role,
                photoUrl: `https://picsum.photos/100/100?sig=${Date.now()}`,
                password: newUser.password,
                department: newUser.department
            } as User]);
            setIsAddUserModalOpen(false);
            setNewUser({ name: '', password: '', department: '', role: UserRole.STAFF });
        }
    };

    const handleDeleteUser = (userId: string) => {
        onStaffListChange(staffList.filter(u => u.id !== userId));
    };

    const handleAddDepartment = () => {
        if (newDeptName.trim()) {
            onDepartmentsChange([...departments, { id: `dep-${Date.now()}`, name: newDeptName.trim() }]);
            setNewDeptName('');
            setIsAddDepartmentOpen(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-white">إدارة طاقم العمل</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAddDepartmentOpen(true)}
                        className="bg-white/5 text-white px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10"
                    >
                        <Plus className="w-4 h-4" /> قسم جديد
                    </button>
                    <button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="bg-club-yellow text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-club-yellow/20"
                    >
                        <UserPlus className="w-4 h-4" /> إضافة مستخدم
                    </button>
                </div>
            </div>

            {/* عرض الأقسام */}
            <div className="glass rounded-[32px] p-6 border-white/5">
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">الأقسام المسجلة ({departments.length})</h3>
                <div className="flex flex-wrap gap-2">
                    {departments.map(dep => (
                        <span key={dep.id} className="px-4 py-2 bg-white/5 text-white text-xs font-bold rounded-xl border border-white/10">
                            {dep.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* عرض الموظفين */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffList.map(item => (
                    <div key={item.id} className="glass rounded-[32px] p-6 border-white/5 flex items-center gap-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-club-yellow/5 blur-3xl -mr-10 -mt-10"></div>
                        <img src={item.photoUrl} className="w-14 h-14 rounded-2xl border-2 border-club-yellow/20 object-cover" />
                        <div className="flex-1">
                            <h4 className="text-white font-black text-sm">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${item.role === UserRole.ADMIN ? 'border-red-500/50 text-red-500 bg-red-500/5' : 'border-club-yellow/50 text-club-yellow bg-club-yellow/5'}`}>
                                    {item.role}
                                </span>
                                <span className="text-[10px] text-gray-500 font-bold">{item.department || '—'}</span>
                            </div>
                            <p className="text-[9px] text-gray-600 mt-1">ID: {item.memberId}</p>
                        </div>
                        <button
                            onClick={() => handleDeleteUser(item.id)}
                            className="p-2 text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* مودال إضافة مستخدم */}
            {isAddUserModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddUserModalOpen(false)}></div>
                    <div className="glass w-full max-w-sm rounded-[40px] p-8 border-white/10 relative animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-black text-lg">إضافة عضو جديد للطاقم</h3>
                            <button onClick={() => setIsAddUserModalOpen(false)} className="p-2 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-gray-500 font-black mb-2 block uppercase">الاسم الكامل</label>
                                <input
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-club-yellow/30"
                                    placeholder="مثلاً: محمد علي"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 font-black mb-2 block uppercase">كلمة المرور</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-club-yellow/30"
                                    placeholder="كلمة مرور قوية"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 font-black mb-2 block uppercase">القسم</label>
                                <select
                                    value={newUser.department}
                                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-club-yellow/30 font-bold"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    <option value="">— اختر القسم —</option>
                                    {departments.map(dep => (
                                        <option key={dep.id} value={dep.name}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setNewUser({ ...newUser, role: UserRole.STAFF })}
                                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black transition-all ${newUser.role === UserRole.STAFF ? 'bg-club-yellow text-black border-club-yellow' : 'border-white/10 text-gray-500 hover:text-white'}`}
                                >
                                    موظف STAFF
                                </button>
                                <button
                                    onClick={() => setNewUser({ ...newUser, role: UserRole.ADMIN })}
                                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black transition-all ${newUser.role === UserRole.ADMIN ? 'bg-club-yellow text-black border-club-yellow' : 'border-white/10 text-gray-500 hover:text-white'}`}
                                >
                                    مشرف ADMIN
                                </button>
                            </div>

                            <button
                                onClick={handleAddUser}
                                disabled={!newUser.name || !newUser.password || !newUser.department}
                                className={`w-full py-4 rounded-2xl font-black text-xs mt-4 transition-all ${newUser.name && newUser.password && newUser.department ? 'bg-club-yellow text-black shadow-xl shadow-club-yellow/20 hover:scale-[1.02] active:scale-95' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                            >
                                إضافة المستخدم
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال إضافة قسم جديد */}
            {isAddDepartmentOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddDepartmentOpen(false)}></div>
                    <div className="glass w-full max-w-xs rounded-[40px] p-8 border-white/10 relative animate-scale-up">
                        <h3 className="text-white font-black text-lg mb-6">إضافة قسم جديد</h3>
                        <input
                            value={newDeptName}
                            onChange={(e) => setNewDeptName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-club-yellow/30"
                            placeholder="اسم القسم الجديد"
                        />
                        <button
                            onClick={handleAddDepartment}
                            disabled={!newDeptName.trim()}
                            className={`w-full py-4 rounded-2xl font-black text-xs transition-all ${newDeptName.trim() ? 'bg-club-yellow text-black shadow-xl shadow-club-yellow/20 active:scale-95' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                        >
                            إضافة القسم
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
