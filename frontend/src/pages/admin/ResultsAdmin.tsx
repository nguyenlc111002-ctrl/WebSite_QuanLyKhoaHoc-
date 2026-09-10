import React, { useEffect, useState } from 'react';
import { Plus, Search, Award, Edit2, CheckCircle2 } from 'lucide-react';
import { ResultItem, Student, ClassItem } from '../../types';
import { resultsApi, studentsApi, classesApi } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const ResultsAdmin: React.FC = () => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal Input Scores State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: 0,
    classId: 0,
    quizScore: 8.0,
    midtermScore: 8.5,
    finalScore: 8.5,
    comments: 'Học viên học tập chăm chỉ, tương tác tốt.',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await resultsApi.getAll({ search: search.trim() || undefined });
      setResults(res.data);
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
        classesApi.getAll(),
      ]);
      setStudents(stRes.data.items);
      setClasses(cRes.data);
      if (stRes.data.items.length > 0 && cRes.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          studentId: stRes.data.items[0].id,
          classId: cRes.data[0].id,
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
    fetchResults();
  }, [search]);

  const handleOpenAdd = () => {
    setFormData({
      studentId: students[0]?.id || 0,
      classId: classes[0]?.id || 0,
      quizScore: 8.0,
      midtermScore: 8.5,
      finalScore: 8.5,
      comments: 'Đạt kết quả học tập tốt.',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleEditResult = (r: ResultItem) => {
    setFormData({
      studentId: r.studentId,
      classId: r.classId,
      quizScore: r.quizScore,
      midtermScore: r.midtermScore,
      finalScore: r.finalScore,
      comments: r.comments,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.studentId || !formData.classId) {
      setFormError('Vui lòng chọn Học viên và Lớp học.');
      return;
    }

    setSaving(true);
    try {
      await resultsApi.saveResult(formData);
      setIsModalOpen(false);
      fetchResults();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu điểm.');
    } finally {
      setSaving(false);
    }
  };

  // Preview calculated score
  const calculatedTotal = Math.round(
    (formData.quizScore * 0.2 + formData.midtermScore * 0.3 + formData.finalScore * 0.5) * 10
  ) / 10;

  let calculatedGrade = 'Chưa đạt';
  if (calculatedTotal >= 9.0) calculatedGrade = 'Xuất sắc';
  else if (calculatedTotal >= 8.0) calculatedGrade = 'Tốt';
  else if (calculatedTotal >= 6.5) calculatedGrade = 'Khá';
  else if (calculatedTotal >= 5.0) calculatedGrade = 'Trung bình';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">KẾT QUẢ HỌC TẬP</h2>
          <p className="text-xs text-slate-500 mt-1">Nhập điểm kiểm tra, tự động tính điểm tổng kết và xếp loại học viên</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nhập điểm học viên</span>
        </button>
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
        ) : results.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Chưa có kết quả học tập nào được nhập</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Mã HV</th>
                  <th className="px-6 py-3.5">Học Viên</th>
                  <th className="px-6 py-3.5">Lớp Học</th>
                  <th className="px-6 py-3.5">Điểm KT (20%)</th>
                  <th className="px-6 py-3.5">Điểm GK (30%)</th>
                  <th className="px-6 py-3.5">Điểm CK (50%)</th>
                  <th className="px-6 py-3.5">Tổng Kết</th>
                  <th className="px-6 py-3.5">Xếp Loại</th>
                  <th className="px-6 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{r.studentCode}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{r.studentName}</td>
                    <td className="px-6 py-4 text-blue-700 font-medium">{r.className}</td>
                    <td className="px-6 py-4 font-semibold">{r.quizScore}</td>
                    <td className="px-6 py-4 font-semibold">{r.midtermScore}</td>
                    <td className="px-6 py-4 font-semibold">{r.finalScore}</td>
                    <td className="px-6 py-4 font-extrabold text-blue-700 text-sm">
                      {r.totalScore}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={r.grade} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEditResult(r)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100"
                        title="Sửa điểm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Input Scores */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cập nhật kết quả học tập"
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
            <label className="block font-bold text-slate-700 mb-1">Chọn Lớp học *</label>
            <select
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Điểm Kiểm tra (20%)</label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={formData.quizScore}
                onChange={(e) => setFormData({ ...formData, quizScore: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Điểm Giữa kỳ (30%)</label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={formData.midtermScore}
                onChange={(e) => setFormData({ ...formData, midtermScore: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Điểm Cuối kỳ (50%)</label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={formData.finalScore}
                onChange={(e) => setFormData({ ...formData, finalScore: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold"
              />
            </div>
          </div>

          {/* Auto calculated result preview */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-blue-600 font-semibold block uppercase">Điểm Tổng Kết Tính Tự Động</span>
              <span className="text-lg font-extrabold text-blue-900">{calculatedTotal} / 10</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Xếp loại dự kiến</span>
              <Badge status={calculatedGrade} />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nhận xét giảng viên</label>
            <textarea
              rows={2}
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
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
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu kết quả học tập'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
