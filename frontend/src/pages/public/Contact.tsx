import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-14 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">LIÊN HỆ & TƯ VẤN</h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            Trung tâm Ngoại ngữ Việt Hàn sẵn sàng tư vấn và giải đáp mọi thắc mắc của bạn 24/7.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info Card */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Thông tin liên hệ</h2>
            <ul className="space-y-5 text-sm text-slate-600">
              <li className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Địa chỉ trung tâm:</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Ấp Lộc Thới, xã Lộc Thuận, tỉnh Vĩnh Long</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Hotline tư vấn tuyển sinh:</h4>
                  <p className="text-xs font-bold text-blue-700 mt-0.5">0332 789 835</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Email phản hồi & Hợp tác:</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Chinguyenle111002@gmail.com</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Giờ làm việc:</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Thứ 2 - Thứ 7: 08:00 - 21:00 (Nghỉ Chủ Nhật)</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Gửi tin nhắn trực tiếp</h2>
            {sent ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Cảm ơn bạn đã liên hệ!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thông tin phản hồi của bạn đã được ghi nhận. Đội ngũ Việt Hàn sẽ hồi đáp qua Email/SĐT trong thời gian sớm nhất.
                </p>
                <button onClick={() => setSent(false)} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0988123456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung thắc mắc *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Hãy nhập câu hỏi hoặc yêu cầu tư vấn của bạn tại đây..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>GỬI TIN NHẮN PHẢN HỒI</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
