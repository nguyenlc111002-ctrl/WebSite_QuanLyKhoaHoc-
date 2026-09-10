import React from 'react';
import { GraduationCap, Award, Users, CheckCircle2, ShieldCheck, Target, HeartHandshake } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-widest block">GIỚI THIỆU TRUNG TÂM</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">TRUNG TÂM NGOẠI NGỮ VIỆT HÀN</h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Khẳng định uy tín hàng đầu trong đào tạo ngoại ngữ Tiếng Hàn, Tiếng Anh, Tiếng Nhật chất lượng cao.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Sứ mệnh & Tầm nhìn</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Trung tâm Ngoại ngữ Việt Hàn được thành lập với mục tiêu làm cầu nối ngôn ngữ và văn hóa, giúp thế hệ trẻ Việt Nam tự tin làm chủ các ngôn ngữ Tiếng Hàn, Tiếng Anh và Tiếng Nhật. Chúng tôi không chỉ dạy từ vựng, ngữ pháp mà còn truyền cảm hứng học tập và trang bị kỹ năng hội nhập môi trường quốc tế.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Tầm nhìn chiến lược</h4>
                  <p className="text-xs text-slate-500">Trở thành thương hiệu đào tạo ngoại ngữ hàng đầu với tỷ lệ học viên đạt chứng chỉ TOPIK, IELTS & JLPT trên 95%.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Giá trị cốt lõi</h4>
                  <p className="text-xs text-slate-500">Tận tâm - Chất lượng - Sáng tạo - Đồng hành đến cùng vì sự thành công của học viên.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Viet Han Center"
              className="rounded-3xl shadow-xl border border-slate-200"
            />
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Đội ngũ hàng đầu</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Giảng viên Bản ngữ & Thạc sĩ Việt Nam tốt nghiệp các trường ĐH danh tiếng.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Giáo trình quốc tế</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Cập nhật theo tiêu chuẩn khung tham chiếu ngôn ngữ châu Âu & Hàn Quốc mới nhất.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Cam kết chuẩn đầu ra</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Hỗ trợ học lại miễn phí 100% nếu học viên đi học và làm bài tập đầy đủ nhưng chưa thi đạt.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Lớp học sĩ số nhỏ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Tối đa 15-20 học viên/lớp nhằm đảm bảo mọi học viên đều được tương tác trực tiếp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
