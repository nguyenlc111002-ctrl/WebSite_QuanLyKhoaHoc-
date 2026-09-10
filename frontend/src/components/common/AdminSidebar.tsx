import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  School,
  Calendar,
  CreditCard,
  Award,
  TrendingUp,
  FileCheck2,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pendingCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose, pendingCount = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Khóa học', path: '/admin/courses', icon: BookOpen },
    { title: 'Học viên', path: '/admin/students', icon: GraduationCap },
    { title: 'Giảng viên', path: '/admin/teachers', icon: Users },
    { title: 'Lớp học', path: '/admin/classes', icon: School },
    { title: 'Lịch học', path: '/admin/schedules', icon: Calendar },
    { title: 'Học phí', path: '/admin/payments', icon: CreditCard },
    { title: 'Kết quả học tập', path: '/admin/results', icon: Award },
    { title: 'Tiến độ học tập', path: '/admin/progress', icon: TrendingUp },
    {
      title: 'Đăng ký khóa học',
      path: '/admin/registrations',
      icon: FileCheck2,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    { title: 'Thống kê & Báo cáo', path: '/admin/reports', icon: BarChart3 },
    { title: 'Cài đặt tài khoản', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none">VIỆT HÀN</h1>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">ADMIN PORTAL</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-blue-200 border border-blue-700 flex items-center justify-center text-xs font-bold">
              {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-blue-500/20 text-blue-300 mt-0.5">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
