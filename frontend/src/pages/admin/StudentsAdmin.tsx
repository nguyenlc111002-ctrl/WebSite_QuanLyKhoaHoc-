import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, GraduationCap, Download, Filter, Eye } from 'lucide-react';
import { Student, ClassItem } from '../../types';
import { studentsApi, classesApi, exportApi } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';

export const StudentsAdmin: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [classId, setClassId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    dateOfBirth: '2002-01-01',
    gender: 'Nam',
    phone: '',
    email: '',
    address: '',
    classId: undefined as number | undefined,
    status: 'Đang học',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Detail Modal State
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentsApi.getAll({
        search: search.trim() || undefined,
        classId: classId,
        status: status || undefined,
        page,
        pageSize: 8,
      });
      setStudents(res.data.items);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await classesApi.getAll();
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [search, classId, status, page]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      code: `HV2026${Math.floor(100 + Math.random() * 900)}`,
      fullName: '',
      dateOfBirth: '2003-05-15',
      gender: 'Nam',
      phone: '',
      email: '',
      address: 'Đà Nẵng',
      classId: classes[0]?.id,
      status: 'Đang học',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (st: Student) => {
    setEditingStudent(st);
    setFormData({
      code: st.code,
      fullName: st.fullName,
      dateOfBirth: st.dateOfBirth.substring(0, 10),
      gender: st.gender,
      phone: st.phone,
      email: st.email,
      address: st.address,
      classId: st.classId,
      status: st.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.code || !formData.fullName || !formData.phone || !formData.email) {
      setFormError('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    setSaving(true);
    try {
      if (editingStudent) {
        await studentsApi.update(editingStudent.id, formData);
      } else {
        await studentsApi.create(formData);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu học viên.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await studentsApi.delete(deletingId);
      setDeletingId(null);
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa học viên này.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const res = await exportApi.exportStudents();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DanhSachHocVien_VietHan_${new Date().toISOString().substring(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Không thể xuất file Excel!');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">QUẢN LÝ HỌC VIÊN</h2>
          <p className="text-xs text-slate-500 mt-1">Danh sách thông tin học viên, lớp học và tình trạng học phí</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 font-bold text-xs bg-white transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm học viên mới</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên, mã, SĐT, Email học viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <select
          value={classId || ''}
          onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">Tất cả Lớp học</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">Tất cả Trạng thái</option>
          <option value="Đang học">Đang học</option>
          <option value="Đã hoàn thành">Đã hoàn thành</option>
          <option value="Bảo lưu">Bảo lưu</option>
          <option value="Nghỉ học">Nghỉ học</option>
        </select>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Không tìm thấy học viên phù hợp</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Mã HV</th>
                    <th className="px-6 py-3.5">Họ Và Tên</th>
                    <th className="px-6 py-3.5">Liên Hệ</th>
                    <th className="px-6 py-3.5">Lớp Học</th>
                    <th className="px-6 py-3.5">Học Phí</th>
                    <th className="px-6 py-3.5">Thanh Toán</th>
                    <th className="px-6 py-3.5">Trạng Thái</th>
                    <th className="px-6 py-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{st.code}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 block">{st.fullName}</span>
                        <span className="text-[11px] text-slate-400">{st.gender} • {new Date(st.dateOfBirth).toLocaleDateString('vi-VN')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 block">{st.phone}</span>
                        <span className="text-[11px] text-slate-400">{st.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-blue-700 block">{st.className}</span>
                        <span className="text-[11px] text-slate-400">{st.courseTitle}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 block">{st.totalFee.toLocaleString('vi-VN')} VNĐ</span>
                        <span className="text-[11px] text-emerald-600">Đã đóng: {st.paidAmount.toLocaleString('vi-VN')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={st.paymentStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={st.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setViewingStudent(st)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(st)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(st.id)}
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

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={8}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Sửa thông tin học viên' : 'Thêm học viên mới'}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã học viên *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phân vào Lớp học</label>
              <select
                value={formData.classId || ''}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="">-- Chưa phân lớp --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.currentStudentCount}/{c.capacity} HV)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Trạng thái học viên</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Đang học">Đang học</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Bảo lưu">Bảo lưu</option>
                <option value="Nghỉ học">Nghỉ học</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Địa chỉ thường trú</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu học viên'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      {viewingStudent && (
        <Modal
          isOpen={true}
          onClose={() => setViewingStudent(null)}
          title={`Hồ sơ học viên: ${viewingStudent.fullName}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600">Mã Học Viên</span>
                <h4 className="text-lg font-extrabold text-blue-900">{viewingStudent.code}</h4>
              </div>
              <Badge status={viewingStudent.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block text-[10px]">Họ và tên</span>
                <span className="font-bold text-slate-900">{viewingStudent.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Ngày sinh</span>
                <span className="font-semibold">{new Date(viewingStudent.dateOfBirth).toLocaleDateString('vi-VN')} ({viewingStudent.gender})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Số điện thoại</span>
                <span className="font-semibold text-slate-900">{viewingStudent.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Email</span>
                <span className="font-semibold">{viewingStudent.email}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Địa chỉ</span>
                <span className="font-semibold">{viewingStudent.address}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">Thông tin Khóa & Học phí</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Lớp đang học:</span>
                  <span className="font-bold text-blue-700">{viewingStudent.className}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Giảng viên:</span>
                  <span className="font-semibold">{viewingStudent.teacherName || 'Chưa gán'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tổng học phí:</span>
                  <span className="font-bold text-slate-900">{viewingStudent.totalFee.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Đã đóng / Còn thiếu:</span>
                  <span className="font-bold text-emerald-600">{viewingStudent.paidAmount.toLocaleString('vi-VN')}</span> / <span className="font-bold text-rose-600">{viewingStudent.remainingFee.toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        message="Bạn có chắc chắn muốn xóa học viên này khỏi cơ sở dữ liệu không?"
      />
    </div>
  );
};
