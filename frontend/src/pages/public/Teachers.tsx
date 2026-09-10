import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, BookOpen, Award } from 'lucide-react';
import { Teacher } from '../../types';
import { teachersApi } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const res = await teachersApi.getAll({ language: language || undefined });
        setTeachers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [language]);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-14 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">ĐỘI NGŨ GIẢNG VIÊN</h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            Hội tụ đội ngũ Giảng viên Bản ngữ và Việt Nam giàu kinh nghiệm, chuyên môn cao và tận tâm với học viên.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-xs border border-slate-200 mb-8">
          <span className="text-xs font-semibold text-slate-600">Lọc theo ngôn ngữ giảng dạy:</span>
          <div className="flex items-center gap-2">
            {['', 'Tiếng Hàn', 'Tiếng Anh', 'Tiếng Nhật'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  language === lang
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang || 'Tất cả'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatarUrl}
                      alt={t.fullName}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-100 shadow-sm"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 uppercase block">{t.teachingLanguage}</span>
                      <h3 className="text-lg font-bold text-slate-900">{t.fullName}</h3>
                      <span className="text-xs text-slate-500 font-medium">{t.experience}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      {t.specialization}
                    </p>
                    <p className="text-slate-600 line-clamp-3 leading-relaxed pt-1">{t.description}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    {t.email}
                  </span>
                  <Badge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
