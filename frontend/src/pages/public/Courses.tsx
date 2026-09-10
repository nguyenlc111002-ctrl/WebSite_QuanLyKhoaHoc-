import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Users, ArrowUpDown, BookOpen, Sparkles } from 'lucide-react';
import { Course } from '../../types';
import { coursesApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await coursesApi.getAll({
        search: search.trim() || undefined,
        language: language || undefined,
        level: level || undefined,
        status: status || undefined,
        sort: sort || undefined,
      });
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, language, level, status, sort]);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-14 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">DANH SÁCH KHÓA HỌC</h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            Các chương trình đào tạo Tiếng Hàn, Tiếng Anh, Tiếng Nhật đa dạng trình độ, lộ trình bài bản, chuẩn đầu ra.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học theo tên hoặc mã..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Language Filter */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="">Tất cả Ngôn ngữ</option>
              <option value="Tiếng Hàn">Tiếng Hàn</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
              <option value="Tiếng Nhật">Tiếng Nhật</option>
              <option value="Tiếng Trung">Tiếng Trung</option>
            </select>

            {/* Level Filter */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="">Tất cả Trình độ</option>
              <option value="Sơ cấp">Sơ cấp</option>
              <option value="Trung cấp">Trung cấp</option>
              <option value="Cao cấp">Cao cấp</option>
              <option value="TOPIK I">TOPIK I</option>
              <option value="TOPIK II">TOPIK II</option>
              <option value="IELTS">IELTS</option>
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="Đang mở đăng ký">Đang mở đăng ký</option>
              <option value="Đang học">Đang học</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
              <option value="Tạm dừng">Tạm dừng</option>
            </select>
          </div>

          {/* Sort bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Hiển thị {courses.length} khóa học phù hợp</span>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sắp xếp học phí:</span>
              <button
                onClick={() => setSort(sort === 'fee_asc' ? '' : 'fee_asc')}
                className={`px-2.5 py-1 rounded-lg border font-medium ${
                  sort === 'fee_asc' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Tăng dần
              </button>
              <button
                onClick={() => setSort(sort === 'fee_desc' ? '' : 'fee_desc')}
                className={`px-2.5 py-1 rounded-lg border font-medium ${
                  sort === 'fee_desc' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Giảm dần
              </button>
            </div>
          </div>
        </div>

        {/* Courses Cards Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 mt-4">Đang tải danh sách khóa học...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Không tìm thấy khóa học phù hợp</h3>
            <p className="text-xs text-slate-500">Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge status={course.status} />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    {course.language} • {course.level}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                      MÃ: {course.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Users className="w-4 h-4 text-purple-500" />
                        {course.totalStudentsCount} học viên
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-500">Học phí:</span>
                      <span className="text-base font-extrabold text-blue-700">
                        {course.tuitionFee.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/courses/${course.id}`}
                    className="w-full text-center py-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs transition-colors"
                  >
                    Xem chi tiết & Đăng ký
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
