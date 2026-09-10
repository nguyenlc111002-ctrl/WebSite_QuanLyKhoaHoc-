import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, School } from 'lucide-react';
import { ScheduleItem, ClassItem } from '../../types';
import { schedulesApi, classesApi } from '../../services/api';

export const Schedules: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [schRes, clsRes] = await Promise.all([
          schedulesApi.getAll({ classId: selectedClass }),
          classesApi.getAll(),
        ]);
        setSchedules(schRes.data);
        setClasses(clsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedClass]);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-14 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">THỜI KHÓA BIỂU HỌC TẬP</h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            Lịch học chi tiết theo ca học, lớp học và phòng học tại Trung tâm Ngoại ngữ Việt Hàn.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-700">Chọn lớp học để xem thời khóa biểu:</span>
          <select
            value={selectedClass || ''}
            onChange={(e) => setSelectedClass(e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="">-- Tất cả lớp học --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.weeklySchedule})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Chưa có lịch học được ghi nhận</h3>
            <p className="text-xs text-slate-500">Vui lòng chọn lớp học khác hoặc quay lại sau.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(s.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    {s.startTime} - {s.endTime}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <p className="font-extrabold text-slate-900 text-sm">{s.className}</p>
                  <p className="flex items-center gap-1.5 text-slate-600">
                    <User className="w-4 h-4 text-purple-500" />
                    <span>Giảng viên: <strong className="text-slate-800">{s.teacherName || 'Đang cập nhật'}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Phòng học: <strong className="text-slate-800">{s.room}</strong></span>
                  </p>
                  {s.note && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 italic mt-2">
                      {s.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
