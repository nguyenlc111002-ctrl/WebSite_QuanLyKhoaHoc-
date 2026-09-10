import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  PhoneCall,
  User,
  ArrowLeft,
  School,
  Sparkles,
} from 'lucide-react';
import { Course } from '../../types';
import { coursesApi, registrationsApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Form modal / inline state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const res = await coursesApi.getById(Number(id));
        setCourse(res.data);
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    setSuccessMsg('');
    setErrorMsg('');

    if (!fullName || !phone || !email) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Email.');
      return;
    }

    setSubmitting(true);
    try {
      await registrationsApi.submitPublic({
        fullName,
        phone,
        email,
        courseId: course.id,
        notes,
      });
      setSuccessMsg('Đăng ký khóa học thành công! Bộ phận tuyển sinh Việt Hàn sẽ liên hệ tư vấn và xếp lớp cho bạn trong vòng 24h.');
      setFullName('');
      setPhone('');
      setEmail('');
      setNotes('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gửi đăng ký thất bại, vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-4">Đang tải thông tin khóa học...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Không tìm thấy khóa học</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">Khóa học này không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Link to="/courses" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Quay lại danh sách khóa học
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách khóa học</span>
        </Link>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 8 Cols: Course overview & details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title Banner Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 mb-6">
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4">
                  <Badge status={course.status} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                    {course.language}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase">
                    Trình độ: {course.level}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    Mã KH: {course.code}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {course.title}
                </h1>
              </div>

              {/* Info Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Thời lượng</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    {course.duration}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Lớp đang mở</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <School className="w-4 h-4 text-purple-500" />
                    {course.totalClassesCount} lớp học
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">Học viên đang theo học</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Users className="w-4 h-4 text-emerald-500" />
                    {course.totalStudentsCount} học viên
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Giới thiệu khóa học</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>

              {/* Course Highlights */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Quyền lợi học viên</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Giảng viên kèm sát phát âm chuẩn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Giáo trình chuẩn quốc tế cập nhật 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Thực hành phản xạ giao tiếp liên tục</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Cấp chứng nhận hoàn thành khóa học</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Registration Form & Pricing */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pricing Box */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block">Học phí niêm yết</span>
              <div className="text-3xl font-extrabold text-white">
                {course.tuitionFee.toLocaleString('vi-VN')} <span className="text-sm font-semibold">VNĐ</span>
              </div>
              <p className="text-xs text-blue-200 border-t border-white/10 pt-3">
                * Học phí đã bao gồm trọn gói giáo trình, tài liệu luyện tập và lệ phí thi cuối khóa.
              </p>
            </div>

            {/* Registration Form Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>ĐĂNG KÝ KHÓA HỌC</span>
              </div>

              {successMsg ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-2">
                  <p className="font-bold">{successMsg}</p>
                  <button
                    onClick={() => setSuccessMsg('')}
                    className="mt-2 text-blue-600 hover:underline font-semibold"
                  >
                    Đăng ký cho người khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      placeholder="0988123456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú nguyện vọng</label>
                    <textarea
                      rows={3}
                      placeholder="Lịch học mong muốn, câu hỏi thắc mắc..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Đang gửi thông tin...' : 'GỬI ĐĂNG KÝ NGAY'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
