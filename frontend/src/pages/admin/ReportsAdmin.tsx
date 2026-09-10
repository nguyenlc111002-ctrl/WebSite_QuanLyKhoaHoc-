import React, { useEffect, useState } from 'react';
import { BarChart3, Download, TrendingUp, DollarSign, Users, Award, BookOpen } from 'lucide-react';
import { exportApi, dashboardApi } from '../../services/api';
import { DashboardSummary } from '../../types';

export const ReportsAdmin: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    dashboardApi.getSummary().then((res) => setSummary(res.data)).catch(console.error);
  }, []);

  const handleExportStudents = async () => {
    try {
      const res = await exportApi.exportStudents();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BaoCaoHocVien_VietHan_${new Date().toISOString().substring(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Lỗi xuất file Excel!');
    }
  };

  const handleExportPayments = async () => {
    try {
      const res = await exportApi.exportPayments();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BaoCaoDoanhThu_VietHan_${new Date().toISOString().substring(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Lỗi xuất file Excel!');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">THỐNG KÊ & BÁO CÁO</h2>
          <p className="text-xs text-slate-500 mt-1">Xuất báo cáo định kỳ về Doanh thu, Học viên và Khóa học</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Báo cáo Doanh thu Học phí</h3>
              <p className="text-xs text-slate-500">Xuất file Excel thống kê từng đợt đóng học phí của học viên</p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
            <p><strong>Tổng doanh thu thực thu:</strong> {summary?.totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>Dự thu còn thiếu:</strong> {summary?.pendingTuition.toLocaleString('vi-VN')} VNĐ</p>
          </div>
          <button
            onClick={handleExportPayments}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Báo Cáo Doanh Thu (Excel)</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Báo cáo Danh sách Học viên</h3>
              <p className="text-xs text-slate-500">Xuất danh sách học viên theo lớp, trạng thái và học phí</p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
            <p><strong>Tổng số học viên:</strong> {summary?.totalStudents} học viên</p>
            <p><strong>Số học viên đang học:</strong> {summary?.activeStudents} học viên</p>
          </div>
          <button
            onClick={handleExportStudents}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Báo Cáo Học Viên (Excel)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
