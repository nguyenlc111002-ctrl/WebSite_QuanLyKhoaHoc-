import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, Award, Mail, Phone } from 'lucide-react';
import { Teacher } from '../../types';
import { teachersApi } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';

export const TeachersAdmin: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    avatarUrl: '',
    teachingLanguage: 'Tiếng Hàn',
    specialization: '',
    phone: '',
    email: '',
    experience: '5 năm kinh nghiệm',
    description: '',
    status: 'Đang giảng dạy',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await teachersApi.getAll({
        search: search.trim() || undefined,
        language: language || undefined,
      });
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [search, language]);

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      code: `GV-KOR${Math.floor(10 + Math.random() * 90)}`,
      fullName: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      teachingLanguage: 'Tiếng Hàn',
      specialization: 'Thạc sĩ Ngôn ngữ Hàn',
      phone: '',
      email: '',
      experience: '5 năm kinh nghiệm',
      description: '',
      status: 'Đang giảng dạy',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setFormData({
      code: t.code,
      fullName: t.fullName,
      avatarUrl: t.avatarUrl,
      teachingLanguage: t.teachingLanguage,
      specialization: t.specialization,
      phone: t.phone,
      email: t.email,
      experience: t.experience,
      description: t.description,
      status: t.status,
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
      if (editingTeacher) {
        await teachersApi.update(editingTeacher.id, formData);
      } else {
        await teachersApi.create(formData);
      }
      setIsModalOpen(false);
      fetchTeachers();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu giảng viên.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await teachersApi.delete(deletingId);
      setDeletingId(null);
      fetchTeachers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa giảng viên này.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">QUẢN LÝ GIẢNG VIÊN</h2>
          <p className="text-xs text-slate-500 mt-1">Danh sách đội ngũ giảng viên và phân công giảng dạy</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm giảng viên mới</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên, mã, chuyên môn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">Tất cả ngôn ngữ giảng dạy</option>
          <option value="Tiếng Hàn">Tiếng Hàn</option>
          <option value="Tiếng Anh">Tiếng Anh</option>
          <option value="Tiếng Nhật">Tiếng Nhật</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Không tìm thấy giảng viên</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Mã GV</th>
                  <th className="px-6 py-3.5">Giảng Viên</th>
                  <th className="px-6 py-3.5">Ngôn Ngữ & Chuyên Môn</th>
                  <th className="px-6 py-3.5">Liên Hệ</th>
                  <th className="px-6 py-3.5">Lớp Đang Phụ Trách</th>
                  <th className="px-6 py-3.5">Trạng Thái</th>
                  <th className="px-6 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{t.code}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={t.avatarUrl} alt={t.fullName} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                        <div>
                          <span className="font-bold text-slate-900 block">{t.fullName}</span>
                          <span className="text-[11px] text-slate-400">{t.experience}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-700 block">{t.teachingLanguage}</span>
                      <span className="text-[11px] text-slate-500">{t.specialization}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 block">{t.phone}</span>
                      <span className="text-[11px] text-slate-400">{t.email}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-purple-700">
                      {t.totalActiveClasses} lớp học
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={t.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(t.id)}
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

      {/* Modal Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? 'Sửa thông tin giảng viên' : 'Thêm giảng viên mới'}
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
              <label className="block font-bold text-slate-700 mb-1">Mã giảng viên *</label>
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
              <label className="block font-bold text-slate-700 mb-1">Ngôn ngữ giảng dạy *</label>
              <select
                value={formData.teachingLanguage}
                onChange={(e) => setFormData({ ...formData, teachingLanguage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Tiếng Hàn">Tiếng Hàn</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Tiếng Nhật">Tiếng Nhật</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chuyên môn / Bằng cấp</label>
              <input
                type="text"
                placeholder="Thạc sĩ, TOPIK 6, IELTS 8.5..."
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
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
              <label className="block font-bold text-slate-700 mb-1">Kinh nghiệm</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Trạng thái *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Đang giảng dạy">Đang giảng dạy</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Link Ảnh Avatar</label>
            <input
              type="text"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Giới thiệu bản thân</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-sm disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu giảng viên'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        message="Bạn có chắc chắn muốn xóa giảng viên này khỏi danh sách không?"
      />
    </div>
  );
};
