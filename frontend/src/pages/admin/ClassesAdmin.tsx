import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, School, Users, Eye } from 'lucide-react';
import { ClassItem, Course, Teacher, Student } from '../../types';
import { classesApi, coursesApi, teachersApi } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';

export const ClassesAdmin: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Modal Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    courseId: 0,
    teacherId: undefined as number | undefined,
    room: 'Phòng A.101',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    studyHours: '18:00 - 19:30',
    weeklySchedule: 'Thứ 2 - Thứ 4 - Thứ 6',
    capacity: 20,
    status: 'Sắp khai giảng',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // View Class Students Modal
  const [viewingClassStudents, setViewingClassStudents] = useState<Student[] | null>(null);
  const [viewingClassName, setViewingClassName] = useState('');

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await classesApi.getAll({
        search: search.trim() || undefined,
        status: status || undefined,
      });
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [cRes, tRes] = await Promise.all([coursesApi.getAll(), teachersApi.getAll()]);
      setCourses(cRes.data);
      setTeachers(tRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [search, status]);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      code: `LH-KOR-${Math.floor(10 + Math.random() * 90)}`,
      name: '',
      courseId: courses[0]?.id || 0,
      teacherId: teachers[0]?.id,
      room: 'Phòng A.201',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      studyHours: '18:00 - 19:30',
      weeklySchedule: 'Thứ 2 - Thứ 4 - Thứ 6',
      capacity: 20,
      status: 'Sắp khai giảng',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: ClassItem) => {
    setEditingClass(cls);
    setFormData({
      code: cls.code,
      name: cls.name,
      courseId: cls.courseId,
      teacherId: cls.teacherId,
      room: cls.room,
      startDate: cls.startDate.substring(0, 10),
      endDate: cls.endDate.substring(0, 10),
      studyHours: cls.studyHours,
      weeklySchedule: cls.weeklySchedule,
      capacity: cls.capacity,
      status: cls.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.code || !formData.name || !formData.courseId) {
      setFormError('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    setSaving(true);
    try {
      if (editingClass) {
        await classesApi.update(editingClass.id, formData);
      } else {
        await classesApi.create(formData);
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu lớp học.');
    } finally {
      setSaving(false);
    }
  };

  const handleViewStudents = async (cls: ClassItem) => {
    setViewingClassName(cls.name);
    try {
      const res = await classesApi.getClassStudents(cls.id);
      setViewingClassStudents(res.data);
    } catch (err) {
      alert('Không thể tải danh sách học viên trong lớp.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await classesApi.delete(deletingId);
      setDeletingId(null);
      fetchClasses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể xóa lớp học này.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">QUẢN LÝ LỚP HỌC</h2>
          <p className="text-xs text-slate-500 mt-1">Quản lý các lớp học, phân công giảng viên và gán phòng học</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo lớp học mới</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên lớp, mã lớp, phòng học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          <option value="">Tất cả trạng thái lớp</option>
          <option value="Sắp khai giảng">Sắp khai giảng</option>
          <option value="Đang học">Đang học</option>
          <option value="Đã kết thúc">Đã kết thúc</option>
          <option value="Tạm dừng">Tạm dừng</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <School className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Không tìm thấy lớp học</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Mã Lớp</th>
                  <th className="px-6 py-3.5">Tên Lớp & Khóa Học</th>
                  <th className="px-6 py-3.5">Giảng Viên</th>
                  <th className="px-6 py-3.5">Thời Gian & Lịch Học</th>
                  <th className="px-6 py-3.5">Sĩ Số / Tối Đa</th>
                  <th className="px-6 py-3.5">Trạng Thái</th>
                  <th className="px-6 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{cls.code}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{cls.name}</span>
                      <span className="text-[11px] text-blue-600 font-medium">{cls.courseTitle}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {cls.teacherName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 block">{cls.weeklySchedule} ({cls.studyHours})</span>
                      <span className="text-[11px] text-slate-400">Phòng: {cls.room}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-purple-700">
                      {cls.currentStudentCount} / {cls.capacity} HV
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={cls.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewStudents(cls)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-purple-600 hover:bg-slate-100"
                        title="Xem danh sách học viên trong lớp"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(cls)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(cls.id)}
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Sửa thông tin lớp học' : 'Tạo lớp học mới'}
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
              <label className="block font-bold text-slate-700 mb-1">Mã lớp học *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Thuộc Khóa học *</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tên lớp học *</label>
            <input
              type="text"
              required
              placeholder="e.g. Lớp Tiếng Hàn Sơ Cấp K101-03"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Giảng viên phụ trách</label>
              <select
                value={formData.teacherId || ''}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="">-- Chưa phân công --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.teachingLanguage})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phòng học *</label>
              <input
                type="text"
                required
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Giờ học *</label>
              <input
                type="text"
                value={formData.studyHours}
                onChange={(e) => setFormData({ ...formData, studyHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lịch học hàng tuần *</label>
              <input
                type="text"
                value={formData.weeklySchedule}
                onChange={(e) => setFormData({ ...formData, weeklySchedule: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sức chứa tối đa *</label>
              <input
                type="number"
                min={1}
                max={100}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Trạng thái *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="Sắp khai giảng">Sắp khai giảng</option>
              <option value="Đang học">Đang học</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
              <option value="Tạm dừng">Tạm dừng</option>
            </select>
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
              {saving ? 'Đang lưu...' : 'Lưu lớp học'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Class Students View Modal */}
      {viewingClassStudents && (
        <Modal
          isOpen={true}
          onClose={() => setViewingClassStudents(null)}
          title={`Danh sách học viên trong lớp: ${viewingClassName}`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            {viewingClassStudents.length === 0 ? (
              <p className="text-slate-500 text-center py-6">Lớp học này hiện chưa có học viên nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-2">Mã HV</th>
                      <th className="px-4 py-2">Họ Và Tên</th>
                      <th className="px-4 py-2">SĐT</th>
                      <th className="px-4 py-2">Học Phí</th>
                      <th className="px-4 py-2">Kết Quả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingClassStudents.map((st) => (
                      <tr key={st.id}>
                        <td className="px-4 py-2.5 font-bold text-slate-900">{st.code}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-800">{st.fullName}</td>
                        <td className="px-4 py-2.5">{st.phone}</td>
                        <td className="px-4 py-2.5">
                          <Badge status={st.paymentStatus} />
                        </td>
                        <td className="px-4 py-2.5 font-bold text-blue-700">{st.learningResult}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingClassStudents(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold"
              >
                Đóng
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
        message="Bạn có chắc chắn muốn xóa lớp học này không?"
      />
    </div>
  );
};
