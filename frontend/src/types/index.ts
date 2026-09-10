export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface Course {
  id: number;
  code: string;
  title: string;
  language: string;
  level: string;
  description: string;
  tuitionFee: number;
  duration: string;
  imageUrl: string;
  status: 'Đang mở đăng ký' | 'Đang học' | 'Đã kết thúc' | 'Tạm dừng' | string;
  createdAt: string;
  totalClassesCount: number;
  totalStudentsCount: number;
}

export interface Teacher {
  id: number;
  code: string;
  fullName: string;
  avatarUrl: string;
  teachingLanguage: string;
  specialization: string;
  phone: string;
  email: string;
  experience: string;
  description: string;
  status: 'Đang giảng dạy' | 'Tạm nghỉ' | string;
  createdAt: string;
  totalActiveClasses: number;
}

export interface ClassItem {
  id: number;
  code: string;
  name: string;
  courseId: number;
  courseTitle: string;
  courseLanguage: string;
  teacherId?: number;
  teacherName: string;
  teacherAvatar: string;
  room: string;
  startDate: string;
  endDate: string;
  studyHours: string;
  weeklySchedule: string;
  capacity: number;
  currentStudentCount: number;
  status: 'Sắp khai giảng' | 'Đang học' | 'Đã kết thúc' | 'Tạm dừng' | string;
  createdAt: string;
}

export interface Student {
  id: number;
  code: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  registrationDate: string;
  classId?: number;
  className: string;
  courseId?: number;
  courseTitle: string;
  teacherName: string;
  totalFee: number;
  paidAmount: number;
  remainingFee: number;
  paymentStatus: 'Chưa đóng' | 'Đã đóng một phần' | 'Đã thanh toán đủ' | string;
  learningResult: string;
  totalScore?: number;
  attendanceRate: number;
  status: 'Đang học' | 'Đã hoàn thành' | 'Bảo lưu' | 'Nghỉ học' | string;
  createdAt: string;
}

export interface Registration {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  courseId: number;
  courseTitle: string;
  courseFee: number;
  notes: string;
  status: 'Mới' | 'Đã liên hệ' | 'Đã tư vấn' | 'Đã đăng ký' | 'Đã hủy' | string;
  createdAt: string;
}

export interface ScheduleItem {
  id: number;
  classId: number;
  className: string;
  classCode: string;
  teacherName: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  note: string;
}

export interface PaymentItem {
  id: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  courseId: number;
  courseTitle: string;
  totalCourseFee: number;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  notes: string;
}

export interface ResultItem {
  id: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  classId: number;
  className: string;
  courseTitle: string;
  quizScore: number;
  midtermScore: number;
  finalScore: number;
  totalScore: number;
  grade: 'Xuất sắc' | 'Tốt' | 'Khá' | 'Trung bình' | 'Chưa đạt' | string;
  comments: string;
  updatedAt: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  studentCount: number;
}

export interface CourseStudentCount {
  courseName: string;
  studentCount: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface DashboardSummary {
  totalCourses: number;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeClasses: number;
  activeStudents: number;
  totalRevenue: number;
  pendingTuition: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  monthlyRevenue: MonthlyRevenue[];
  studentsPerCourse: CourseStudentCount[];
  paymentStatusDistribution: StatusCount[];
  studentStatusDistribution: StatusCount[];
}
