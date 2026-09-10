import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Users,
  School,
  DollarSign,
  AlertCircle,
  TrendingUp,
  FileCheck2,
  ArrowUpRight,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { DashboardSummary } from '../../types';
import { dashboardApi } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await dashboardApi.getSummary();
        setSummary(res.data);
      } catch (err) {
        console.error('Error loading dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-4">Đang nạp dữ liệu thống kê từ SQL Server...</p>
      </div>
    );
  }

  // Monthly Revenue Chart Data
  const monthlyRevenueData = {
    labels: summary?.monthlyRevenue.map((m) => m.month) || [],
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: summary?.monthlyRevenue.map((m) => m.revenue) || [],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Students per Course Chart Data
  const studentsPerCourseData = {
    labels: summary?.studentsPerCourse.map((c) => c.courseName) || [],
    datasets: [
      {
        data: summary?.studentsPerCourse.map((c) => c.studentCount) || [],
        backgroundColor: [
          '#3B82F6',
          '#8B5CF6',
          '#10B981',
          '#F59E0B',
          '#EC4899',
          '#6366F1',
        ],
      },
    ],
  };

  // Payment Status Chart Data
  const paymentStatusData = {
    labels: summary?.paymentStatusDistribution.map((p) => p.status) || [],
    datasets: [
      {
        data: summary?.paymentStatusDistribution.map((p) => p.count) || [],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Overview Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng doanh thu học phí</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {summary?.totalRevenue.toLocaleString('vi-VN')} <span className="text-xs font-normal">VNĐ</span>
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tăng trưởng học phí thực tế</span>
          </div>
        </div>

        {/* Card 2: Pending Tuition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Học phí còn thiếu</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {summary?.pendingTuition.toLocaleString('vi-VN')} <span className="text-xs font-normal">VNĐ</span>
          </p>
          <p className="text-[11px] text-slate-400">Cần đôn đốc học viên thanh toán</p>
        </div>

        {/* Card 3: Active Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Học viên đang học</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {summary?.activeStudents} / {summary?.totalStudents} <span className="text-xs font-normal">HV</span>
          </p>
          <p className="text-[11px] text-slate-400">Tổng số học viên toàn hệ thống</p>
        </div>

        {/* Card 4: Active Classes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lớp đang hoạt động</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <School className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {summary?.activeClasses} / {summary?.totalClasses} <span className="text-xs font-normal">lớp</span>
          </p>
          <p className="text-[11px] text-slate-400">Gồm lớp đang học & sắp khai giảng</p>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block">Khóa học</span>
          <span className="text-xl font-bold text-slate-900">{summary?.totalCourses}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block">Giảng viên</span>
          <span className="text-xl font-bold text-slate-900">{summary?.totalTeachers}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block">Đăng ký mới</span>
          <span className="text-xl font-bold text-amber-600">{summary?.pendingRegistrations}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block">Tổng số đăng ký</span>
          <span className="text-xl font-bold text-blue-600">{summary?.totalRegistrations}</span>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Biểu đồ doanh thu học phí (6 tháng gần nhất)</h3>
            <span className="text-xs text-slate-400">Cập nhật tự động</span>
          </div>
          <div className="h-64">
            <Bar data={monthlyRevenueData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Students Per Course Pie Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Tỷ lệ học viên theo khóa học</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={studentsPerCourseData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Tình trạng thanh toán học phí</h3>
          </div>
          <div className="h-60 flex items-center justify-center">
            <Pie data={paymentStatusData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Summary Note & Quick Actions */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 p-6 rounded-2xl text-white shadow-md flex flex-col justify-between space-y-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs font-semibold uppercase">
              Hệ thống Quản trị Khóa học
            </span>
            <h3 className="text-xl font-bold text-white mt-3">Trung tâm Ngoại ngữ Việt Hàn</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Dữ liệu được cập nhật thời gian thực từ cơ sở dữ liệu Microsoft SQL Server. Tất cả các mô-đun quản lý đã sẵn sàng hoạt động.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="p-3 bg-white/10 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Cơ sở dữ liệu</span>
              <span className="font-bold text-emerald-400">SQL Server (LocalDB)</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Trạng thái kết nối</span>
              <span className="font-bold text-blue-400">Hoạt động bình thường</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
