import React from 'react';

interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    // Course & Class Status
    case 'Đang mở đăng ký':
    case 'Sắp khai giảng':
    case 'Mới':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;

    case 'Đang học':
    case 'Đang giảng dạy':
    case 'Đã thanh toán đủ':
    case 'Xuất sắc':
    case 'Tốt':
    case 'Đã đăng ký':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;

    case 'Đã đóng một phần':
    case 'Đã liên hệ':
    case 'Đã tư vấn':
    case 'Khá':
    case 'Bảo lưu':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;

    case 'Đã kết thúc':
    case 'Đã hoàn thành':
    case 'Tạm dừng':
    case 'Tạm nghỉ':
    case 'Chưa đóng':
    case 'Nghỉ học':
    case 'Đã hủy':
    case 'Chưa đạt':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;

    default:
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};
