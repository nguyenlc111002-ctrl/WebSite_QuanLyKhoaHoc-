import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Users,
  School,
  ArrowRight,
  CheckCircle2,
  Award,
  Sparkles,
  PhoneCall,
  Calendar,
  Globe2,
  Clock,
} from 'lucide-react';
import { Course, Teacher, DashboardSummary } from '../../types';
import { coursesApi, teachersApi, dashboardApi, registrationsApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Form registration state
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    courseId: 0,
    notes: '',
  });
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, courseRes, teacherRes] = await Promise.all([
          dashboardApi.getSummary(),
          coursesApi.getAll(),
          teachersApi.getAll(),
        ]);
        setSummary(sumRes.data);
        setCourses(courseRes.data.slice(0, 3));
        setTeachers(teacherRes.data.slice(0, 4));
        if (courseRes.data.length > 0) {
          setRegForm((prev) => ({ ...prev, courseId: courseRes.data[0].id }));
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess('');
    setRegError('');

    if (!regForm.fullName || !regForm.phone || !regForm.email || !regForm.courseId) {
      setRegError('Vui lòng điền đầy đủ tất cả thông tin bắt buộc.');
      return;
    }

    setSubmitting(true);
    try {
      await registrationsApi.submitPublic({
        fullName: regForm.fullName,
        phone: regForm.phone,
        email: regForm.email,
        courseId: Number(regForm.courseId),
        notes: regForm.notes,
      });
      setRegSuccess('Đăng ký tư vấn thành công! Chuyên viên tư vấn của Trung tâm Việt Hàn sẽ liên hệ với bạn trong vòng 24h.');
      setRegForm({ fullName: '', phone: '', email: '', courseId: courses[0]?.id || 0, notes: '' });
    } catch (err: any) {
      setRegError(err.response?.data?.message || 'Gửi đăng ký thất bại, vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 bg-slate-50 min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 blur-xs"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Text Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Trung tâm Ngoại ngữ Uy tín Hàng đầu</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                TRUNG TÂM NGOẠI NGỮ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">VIỆT HÀN</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Đồng hành cùng bạn trên hành trình chinh phục ngoại ngữ. Đào tạo Tiếng Hàn, Tiếng Anh, Tiếng Nhật giao tiếp và luyện thi chứng chỉ quốc tế chất lượng cao.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Xem khóa học</span>
                </Link>
                <a
                  href="#tu-van-section"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm backdrop-blur-md transition-all hover:scale-105"
                >
                  <PhoneCall className="w-5 h-5 text-blue-400" />
                  <span>Đăng ký tư vấn</span>
                </a>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl text-white space-y-6">
                <h3 className="text-xl font-bold border-b border-white/10 pb-4 text-blue-200">
                  Tại sao nên chọn Ngoại Ngữ Việt Hàn?
                </h3>
                <ul className="space-y-4 text-sm text-slate-200">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Giảng viên Bản ngữ & Việt Nam giàu kinh nghiệm, bằng cấp quốc tế.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Lộ trình học cá nhân hóa, phương pháp phản xạ thực hành 80%.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Cam kết chuẩn đầu ra bằng hợp đồng đào tạo rõ ràng.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Hệ thống quản lý học tập hiện đại, theo dõi sát sao tiến độ.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Cards (Fetched from DB) */}
      <section className="-mt-10 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
                {summary ? summary.totalCourses : '5+'}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khóa học</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
                {summary ? summary.totalStudents : '100+'}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Học viên</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
                {summary ? summary.totalTeachers : '15+'}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Giảng viên</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
                {summary ? summary.activeClasses : '10+'}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lớp đang mở</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Chương trình chất lượng</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Khóa học nổi bật</h2>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
          >
            <span>Xem tất cả khóa học</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
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
                  {course.language} - {course.level}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
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
                    <span className="text-xs text-slate-500">Học phí trọn gói</span>
                    <span className="text-base font-extrabold text-blue-700">
                      {course.tuitionFee.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>

                <Link
                  to={`/courses/${course.id}`}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition-colors"
                >
                  Xem chi tiết & Đăng ký
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teachers Showcase */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Đội ngũ tâm huyết</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Giảng viên tiêu biểu</h2>
            <p className="text-sm text-slate-500 mt-2">
              Giảng viên tại Trung tâm Việt Hàn sở hữu bằng cấp thạc sĩ, chứng chỉ giảng dạy quốc tế và nhiều năm kinh nghiệm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center hover:shadow-lg transition-all group"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img src={t.avatarUrl} alt={t.fullName} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{t.fullName}</h3>
                <p className="text-xs font-semibold text-blue-600 mt-0.5">{t.teachingLanguage}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{t.specialization}</p>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-medium text-slate-600">
                  {t.experience}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Registration Form Section */}
      <section id="tu-van-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Tư vấn miễn phí</span>
              <h2 className="text-3xl font-extrabold text-white">Đăng ký nhận tư vấn khóa học</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Hãy để lại thông tin, đội ngũ chuyên viên của Việt Hàn sẽ liên hệ test trình độ miễn phí và tư vấn lộ trình học phù hợp nhất cho bạn!
              </p>
              <div className="pt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hỗ trợ test trình độ 1-1 miễn phí</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ưu đãi giảm 10% học phí cho học viên đăng ký sớm</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white text-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
              {regSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Đăng ký thành công!</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{regSuccess}</p>
                  <button
                    onClick={() => setRegSuccess('')}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    Đăng ký tư vấn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  {regError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                      {regError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                      <input
                        type="tel"
                        placeholder="0988123456"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Khóa học quan tâm *</label>
                    <select
                      value={regForm.courseId}
                      onChange={(e) => setRegForm({ ...regForm, courseId: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.tuitionFee.toLocaleString('vi-VN')} VNĐ)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú thêm</label>
                    <textarea
                      rows={2}
                      placeholder="Thời gian rảnh, mục tiêu học tập..."
                      value={regForm.notes}
                      onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Đang gửi thông tin...' : 'GỬI ĐĂNG KÝ TƯ VẤN'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
