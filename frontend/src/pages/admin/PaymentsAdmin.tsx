import React, { useEffect, useState } from 'react';
import { Plus, Search, CreditCard, Download, Trash2, DollarSign } from 'lucide-react';
import { PaymentItem, Student, Course } from '../../types';
import { paymentsApi, studentsApi, coursesApi, exportApi } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const PaymentsAdmin: React.FC = () => {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal Add Payment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: 0,
    courseId: 0,
    amountPaid: 1000000,
    paymentDate: new Date().toISOString().substring(0, 10),
    paymentMethod: 'Chuyển khoản',
    notes: 'Thanh toán đợt 1',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentsApi.getAll({ search: search.trim() || undefined });
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [stRes, cRes] = await Promise.all([
        studentsApi.getAll({ pageSize: 100 }),
        coursesApi.getAll(),
      ]);
      setStudents(stRes.data.items);
      setCourses(cRes.data);
      if (stRes.data.items.length > 0 && cRes.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          studentId: stRes.data.items[0].id,
          courseId: cRes.data[0].id,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [search]);

  const handleOpenAdd = () => {
    setFormData({
      studentId: students[0]?.id || 0,
      courseId: courses[0]?.id || 0,
      amountPaid: 1500000,
      paymentDate: new Date().toISOString().substring(0, 10),
      paymentMethod: 'Chuyển khoản',
      notes: 'Ghi nhận đợt thanh toán mới',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.studentId || !formData.courseId || formData.amountPaid <= 0) {
      setFormError('Vui lòng chọn Học viên, Khóa học và nhập Số tiền thanh toán hợp lệ.');
      return;
    }

    setSaving(true);
    try {
      await paymentsApi.create(formData);
      setIsModalOpen(false);
      fetchPayments();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi ghi nhận học phí.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await paymentsApi.delete(deletingId);
      setDeletingId(null);
      fetchPayments();
    } catch (err: any) {
      alert('Không thể xóa giao dịch này.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const res = await exportApi.exportPayments();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BaoCaoHocPhi_VietHan_${new Date().toISOString().substring(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Không thể xuất báo cáo học phí!');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">QUẢN LÝ HỌC PHÍ</h2>
          <p className="text-xs text-slate-500 mt-1">Ghi nhận lịch sử giao dịch, thu học phí và xuất báo cáo tài chính</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 font-bold text-xs bg-white transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất báo cáo Excel</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ghi nhận đợt đóng tiền</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên học viên, mã học viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Chưa có giao dịch học phí nào được lưu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Mã HV</th>
                  <th className="px-6 py-3.5">Học Viên</th>
                  <th className="px-6 py-3.5">Khóa Học</th>
                  <th className="px-6 py-3.5">Số Tiền Đã Đóng</th>
                  <th className="px-6 py-3.5">Ngày Đóng</th>
                  <th className="px-6 py-3.5">Phương Thức</th>
                  <th className="px-6 py-3.5">Ghi Chú</th>
                  <th className="px-6 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{p.studentCode}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{p.studentName}</td>
                    <td className="px-6 py-4 font-medium text-blue-700">{p.courseTitle}</td>
                    <td className="px-6 py-4 font-extrabold text-emerald-600 text-sm">
                      +{p.amountPaid.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="px-6 py-4">
                      {new Date(p.paymentDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{p.notes || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeletingId(p.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-slate-100"
                        title="Xóa giao dịch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add Payment */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ghi nhận thanh toán học phí"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {formError}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Chọn Học viên *</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.code}) - {st.className || 'Chưa gán lớp'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Khóa học thanh toán *</label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.tuitionFee.toLocaleString('vi-VN')} VNĐ)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số tiền thanh toán (VNĐ) *</label>
              <input
                type="number"
                required
                min={1000}
                step={100000}
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold text-blue-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phương thức *</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Thẻ">Thẻ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ngày đóng</label>
            <input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ghi chú giao dịch</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm disabled:opacity-50"
            >
              {saving ? 'Đang xử lý...' : 'Xác nhận thu học phí'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        message="Bạn có chắc chắn muốn xóa lịch sử giao dịch này không?"
      />
    </div>
  );
};
