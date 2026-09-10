import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/common/AdminSidebar';
import { AdminHeader } from '../components/common/AdminHeader';
import { registrationsApi } from '../services/api';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRegCount, setPendingRegCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      registrationsApi.getAllAdmin({ status: 'Mới' }).then((res) => {
        setPendingRegCount(res.data.length);
      }).catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Đang kiểm tra phiên làm việc Admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Get Page Title from pathname
  const pageTitles: Record<string, string> = {
    '/admin/dashboard': '📊 Tổng quan hệ thống Dashboard',
    '/admin/courses': '📚 Quản lý danh sách Khóa học',
    '/admin/students': '👨‍🎓 Quản lý danh sách Học viên',
    '/admin/teachers': '👨‍🏫 Quản lý danh sách Giảng viên',
    '/admin/classes': '🏫 Quản lý Lớp học',
    '/admin/schedules': '📅 Thời khóa biểu & Lịch học Calendar',
    '/admin/payments': '💰 Quản lý Học phí & Tài chính',
    '/admin/results': '📝 Điểm thi & Kết quả học tập',
    '/admin/progress': '📈 Theo dõi Tiến độ & Chuyên cần',
    '/admin/registrations': '📋 Danh sách Đăng ký từ Website Public',
    '/admin/reports': '📊 Báo cáo & Thống kê dữ liệu',
    '/admin/settings': '⚙️ Cài đặt tài khoản Admin',
  };

  const title = pageTitles[location.pathname] || 'Admin Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingCount={pendingRegCount}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={title}
        />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
