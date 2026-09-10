import React, { useEffect, useState } from 'react';
import { FileCheck2, Search, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { Registration } from '../../types';
import { registrationsApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const RegistrationsAdmin: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Status Change Modal State
  const [editingReg, setEditingReg] = useState<Registration | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('Đã tư vấn');
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await registrationsApi.getAllAdmin({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      });
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [search, statusFilter]);

  const handleUpdateStatus = async () => {
    if (!editingReg) return;
    setSaving(true);
    try {
      await registrationsApi.updateStatus(editingReg.id, selectedStatus);
      setEditingReg(null);
      fetchRegistrations();
    } catch (err) {
      alert('Không thể cập nhật trạng thái đăng ký.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await registrationsApi.delete(deletingId);
      setDeletingId(null);
      fetchRegistrations();
    } catch (err) {
      alert('Không thể xóa yêu cầu đăng ký.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">QUẢN LÝ ĐĂNG KÝ KHÓA HỌC</h2>
          <p className="text-xs text-slate-500 mt-1">Danh sách đăng ký tư vấn nhận từ Website Public</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên người đăng ký, SĐT, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">Tất cả trạng thái xử lý</option>
          <option value="Mới">Mới</option>
          <option value="Đã liên hệ">Đã liên hệ</option>
          <option value="Đã tư vấn">Đã tư vấn</option>
          <option value="Đã đăng ký">Đã đăng ký</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Không có yêu cầu đăng ký nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Họ Và Tên</th>
                  <th className="px-6 py-3.5">Số Điện Thoại</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Khóa Học Đăng Ký</th>
                  <th className="px-6 py-3.5">Ngày Đăng Ký</th>
                  <th className="px-6 py-3.5">Ghi Chú</th>
                  <th className="px-6 py-3.5">Trạng Thái</th>
                  <th className="px-6 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {registrations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{r.fullName}</td>
                    <td className="px-6 py-4 font-semibold text-blue-700">{r.phone}</td>
                    <td className="px-6 py-4">{r.email}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{r.courseTitle}</td>
                    <td className="px-6 py-4">
                      {new Date(r.createdAt).toLocaleDateString('vi-VN')} {new Date(r.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{r.notes || '-'}</td>
                    <td className="px-6 py-4">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingReg(r);
                          setSelectedStatus(r.status);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100"
                        title="Cập nhật trạng thái"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(r.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-slate-100"
                        title="Xóa"
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

      {/* Edit Status Modal */}
      {editingReg && (
        <Modal
          isOpen={true}
          onClose={() => setEditingReg(null)}
          title={`Cập nhật trạng thái tư vấn: ${editingReg.fullName}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p><strong>Khóa học:</strong> {editingReg.courseTitle}</p>
              <p><strong>Số điện thoại:</strong> {editingReg.phone}</p>
              <p><strong>Email:</strong> {editingReg.email}</p>
              {editingReg.notes && <p><strong>Ghi chú từ HV:</strong> {editingReg.notes}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Trạng thái mới *</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold"
              >
                <option value="Mới">Mới</option>
                <option value="Đã liên hệ">Đã liên hệ</option>
                <option value="Đã tư vấn">Đã tư vấn</option>
                <option value="Đã đăng ký">Đã đăng ký (Chuyển thành HV)</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingReg(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm disabled:opacity-50"
              >
                {saving ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        message="Bạn có chắc chắn muốn xóa yêu cầu đăng ký này không?"
      />
    </div>
  );
};
