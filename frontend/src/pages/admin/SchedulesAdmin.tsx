import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Edit2, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScheduleItem, ClassItem } from '../../types';
import { schedulesApi, classesApi } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const SchedulesAdmin: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  // View Mode: 'day' | 'week' | 'month'
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>(undefined);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState({
    classId: 0,
    date: new Date().toISOString().substring(0, 10),
    startTime: '18:00',
    endTime: '19:30',
    room: '',
    note: '',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await schedulesApi.getAll({ classId: selectedClassId });
      setSchedules(res.data);
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
      if (res.data.length > 0) {
        setFormData((prev) => ({ ...prev, classId: res.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [selectedClassId, currentDate]);

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setFormData({
      classId: classes[0]?.id || 0,
      date: new Date().toISOString().substring(0, 10),
      startTime: '18:00',
      endTime: '19:30',
      room: 'Phòng A.201',
      note: 'Buổi học định kỳ',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: ScheduleItem) => {
    setEditingSchedule(s);
    setFormData({
      classId: s.classId,
      date: s.date.substring(0, 10),
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room,
      note: s.note,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.classId || !formData.date || !formData.startTime || !formData.endTime) {
      setFormError('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    setSaving(true);
    try {
      if (editingSchedule) {
        await schedulesApi.update(editingSchedule.id, formData);
      } else {
        await schedulesApi.create(formData);
      }
      setIsModalOpen(false);
      fetchSchedules();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu lịch học.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await schedulesApi.delete(deletingId);
      setDeletingId(null);
      fetchSchedules();
    } catch (err: any) {
      alert('Không thể xóa lịch học.');
    } finally {
      setIsDeleting(false);
    }
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">QUẢN LÝ LỊCH HỌC CALENDAR</h2>
          <p className="text-xs text-slate-500 mt-1">Xem thời khóa biểu dạng Lịch theo Ngày, Tuần, Tháng</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm lịch học mới</span>
        </button>
      </div>

      {/* Calendar Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate(-1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-900 px-3">
            {viewMode === 'month'
              ? `Tháng ${currentDate.getMonth() + 1} / ${currentDate.getFullYear()}`
              : currentDate.toLocaleDateString('vi-VN')}
          </span>
          <button
            onClick={() => navigateDate(1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold text-slate-700"
          >
            Hôm nay
          </button>
        </div>

        {/* Filter class */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedClassId || ''}
            onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : undefined)}
            className="px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="">-- Tất cả lớp học --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Mode switch buttons */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                viewMode === 'day' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                viewMode === 'week' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                viewMode === 'month' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Tháng
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Không có ca học nào trong thời gian này</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((s) => (
              <div
                key={s.id}
                className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:shadow-md transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(s.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                    {s.startTime} - {s.endTime}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <p className="font-extrabold text-slate-900 text-sm">{s.className}</p>
                  <p className="text-slate-600">
                    Giảng viên: <strong className="text-slate-800">{s.teacherName || 'Chưa gán'}</strong>
                  </p>
                  <p className="text-slate-600">
                    Phòng học: <strong className="text-slate-800">{s.room}</strong>
                  </p>
                  {s.note && <p className="text-[11px] text-slate-500 italic mt-1">{s.note}</p>}
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-200/60 text-xs">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600"
                    title="Sửa lịch"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(s.id)}
                    className="p-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-red-600"
                    title="Xóa lịch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSchedule ? 'Sửa lịch học' : 'Thêm ca học mới'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {formError}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Lớp học *</label>
            <select
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.weeklySchedule})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ngày học *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Giờ bắt đầu *</label>
              <input
                type="text"
                required
                placeholder="18:00"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Giờ kết thúc *</label>
              <input
                type="text"
                required
                placeholder="19:30"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phòng học</label>
            <input
              type="text"
              placeholder="Phòng A.201"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ghi chú nội dung học</label>
            <textarea
              rows={2}
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
              {saving ? 'Đang lưu...' : 'Lưu lịch học'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        message="Bạn có chắc chắn muốn xóa ca học này không?"
      />
    </div>
  );
};
