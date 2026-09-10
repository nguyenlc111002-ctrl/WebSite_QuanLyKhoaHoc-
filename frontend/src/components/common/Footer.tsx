import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, Globe, Clock, Share2, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About center */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">NGOẠI NGỮ VIỆT HÀN</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trung tâm Ngoại ngữ Việt Hàn - Đơn vị đào tạo tiếng Hàn, tiếng Anh, tiếng Nhật uy tín hàng đầu. Cam kết chất lượng đầu ra và tư vấn du học chuyên nghiệp.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-l-4 border-blue-500 pl-3">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses" className="hover:text-blue-400 transition-colors">Danh sách khóa học</Link></li>
              <li><Link to="/teachers" className="hover:text-blue-400 transition-colors">Đội ngũ giảng viên</Link></li>
              <li><Link to="/classes" className="hover:text-blue-400 transition-colors">Danh sách lớp học</Link></li>
              <li><Link to="/schedule" className="hover:text-blue-400 transition-colors">Thời khóa biểu</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Liên hệ tư vấn</Link></li>
            </ul>
          </div>

          {/* Col 3: Programs */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-l-4 border-blue-500 pl-3">
              Chương trình đào tạo
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-300 font-medium">Tiếng Hàn Sơ cấp - Trung cấp</li>
              <li className="text-slate-300 font-medium">Luyện thi TOPIK I & TOPIK II</li>
              <li className="text-slate-300 font-medium">Tiếng Anh Giao tiếp Phản xạ</li>
              <li className="text-slate-300 font-medium">Luyện thi IELTS Intensive</li>
              <li className="text-slate-300 font-medium">Tiếng Nhật N5 - N4 - N3</li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 border-l-4 border-blue-500 pl-3">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Ấp Lộc Thới, xã Lộc Thuận, tỉnh Vĩnh Long</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="font-semibold text-white">0332 789 835</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Chinguyenle111002@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Thứ 2 - Thứ 7: 08:00 - 21:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Trung Tâm Ngoại Ngữ Việt Hàn. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Chính sách bảo mật</a>
            <a href="#" className="hover:underline">Điều khoản sử dụng</a>
            <Link to="/admin/login" className="text-blue-400 hover:underline">Hệ thống Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
