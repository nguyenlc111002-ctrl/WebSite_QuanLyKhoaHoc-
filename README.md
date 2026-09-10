# WEBSITE QUẢN LÝ KHÓA HỌC - TRUNG TÂM NGOẠI NGỮ VIỆT HÀN

Hệ thống Website Full-Stack Quản lý Khóa học chuyên nghiệp, hiện đại, responsive dành cho **Trung tâm Ngoại ngữ Việt Hàn**. Dự án gồm **Website Public** phục vụ học viên/khách hàng đăng ký tư vấn và **Admin Dashboard** phục vụ ban quản trị quản lý toàn bộ hệ thống khóa học, học viên, giảng viên, lớp học, lịch học, học phí, điểm số và báo cáo thống kê.

---

## 🚀 Công nghệ sử dụng (Tech Stack)

### Backend API:
- **Framework**: ASP.NET Core 10 Web API
- **ORM**: Entity Framework Core 10 (`Microsoft.EntityFrameworkCore.SqlServer`)
- **Database**: SQL Server LocalDB (`(localdb)\mssqllocaldb`), Database Name: `VietHanLanguageCenter`
- **Xác thực**: JWT Bearer Tokens (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- **Bảo mật**: Hashing mật khẩu bằng BCrypt (`BCrypt.Net-Next`)
- **Xuất dữ liệu**: Export file Excel chuẩn `.xlsx` bằng `ClosedXML`

### Frontend UI:
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React Icons
- **Biểu đồ**: Chart.js & `react-chartjs-2`
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (với Request Interceptor tự động gắn JWT Token)

---

## 🔑 Tài khoản Admin Demo

Dữ liệu khởi tạo (Seed Data) đã tự động tạo sẵn 2 tài khoản quản trị trong SQL Server:

| Quyền hạn (Role) | Email | Mật khẩu | Phạm vi quyền |
| :--- | :--- | :--- | :--- |
| **SUPER ADMIN** | `admin@viethan.edu.vn` | `Admin@123456` | Toàn quyền quản trị hệ thống |
| **STAFF** | `staff@viethan.edu.vn` | `Staff@123456` | Quản lý học viên, lớp học, lịch học |

---

## 📂 Cấu trúc Thư mục Dự án

```
WebSite_QuanLyKhoaHoc/
├── WebSite_QuanLyKhoaHoc/          # Backend ASP.NET Core Web API
│   ├── Controllers/               # REST API Controllers
│   │   ├── AuthController.cs
│   │   ├── CoursesController.cs
│   │   ├── TeachersController.cs
│   │   ├── ClassesController.cs
│   │   ├── StudentsController.cs
│   │   ├── RegistrationsController.cs
│   │   ├── SchedulesController.cs
│   │   ├── PaymentsController.cs
│   │   ├── ResultsController.cs
│   │   ├── DashboardController.cs
│   │   └── ExportController.cs
│   ├── Data/                      # Entity Framework DbContext & Seeder
│   │   ├── ApplicationDbContext.cs
│   │   └── DbSeeder.cs            # Tự động seed dữ liệu mẫu vào SQL Server
│   ├── DTOs/                      # Data Transfer Objects
│   ├── Models/                    # Entity Models (Database Schema)
│   ├── Services/                  # JwtService, PasswordHasher
│   ├── Program.cs                 # Configuration & Startup
│   └── appsettings.json           # Connection String SQL Server LocalDB
│
├── frontend/                      # Frontend React + TypeScript + Vite
│   ├── src/
│   │   ├── components/common/     # Navbar, Footer, AdminSidebar, AdminHeader, Modal, Badge...
│   │   ├── context/               # AuthContext (JWT Authentication & Roles)
│   │   ├── layouts/               # PublicLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/            # Home, Courses, CourseDetail, Teachers, Schedules, About, Contact
│   │   │   └── admin/             # Dashboard, Courses, Students, Teachers, Classes, Schedules, Payments, Results, Progress, Registrations, Reports, Settings
│   │   ├── services/              # Axios API Client setup
│   │   ├── types/                 # TypeScript Interfaces
│   │   ├── App.tsx                # App Routing Configuration
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts             # Proxy setup cho `/api` -> `http://localhost:5180`
│
└── README.md
```

---

## 🛠️ Hướng dẫn Chạy Dự án

### Yêu cầu Môi trường:
- **.NET SDK 10.0** trở lên.
- **Node.js v18+** & **npm**.
- **Microsoft SQL Server LocalDB** (Có sẵn theo Visual Studio).

### Bước 1: Khởi chạy Backend ASP.NET Core API
1. Mở Terminal / PowerShell tại thư mục dự án backend:
   ```bash
   cd WebSite_QuanLyKhoaHoc/WebSite_QuanLyKhoaHoc
   ```
2. Chạy ứng dụng Backend (tự động tạo Database `VietHanLanguageCenter` & seed toàn bộ dữ liệu mẫu vào SQL Server trong lần khởi chạy đầu tiên):
   ```bash
   dotnet run --launch-profile http
   ```
   Backend API sẽ lắng nghe tại: `http://localhost:5180`

### Bước 2: Khởi chạy Frontend React Website
1. Mở một cửa sổ Terminal khác tại thư mục frontend:
   ```bash
   cd WebSite_QuanLyKhoaHoc/frontend
   ```
2. Khởi chạy server giao diện:
   ```bash
   npm run dev -- --port 3000
   ```
3. Mở trình duyệt và truy cập:
   - **Website Public**: `http://localhost:3000/`
   - **Trang đăng nhập Admin**: `http://localhost:3000/admin/login`

---

## 🌟 Chức năng Nổi bật của Hệ thống

1. **Website Public dành cho người dùng**:
   - Hero Banner chuyên nghiệp, thống kê động từ Database SQL Server (Số khóa học, số học viên, giảng viên, lớp đang hoạt động).
   - Danh sách khóa học có tìm kiếm theo tên, lọc ngôn ngữ, trình độ, trạng thái và sắp xếp học phí.
   - Trang chi tiết khóa học + Form **Đăng ký tư vấn khóa học** lưu trực tiếp vào cơ sở dữ liệu.
   - Danh sách giảng viên tiêu biểu & Thời khóa biểu công khai.

2. **Admin Dashboard & Phân quyền RBAC**:
   - Xác thực bảo mật JWT Token, mật khẩu được mã hóa BCrypt Hash.
   - Phân quyền 3 cấp độ: `SUPER_ADMIN`, `ADMIN`, `STAFF`.
   - 8 thẻ chỉ số thống kê & 4 biểu đồ tương tác Chart.js (Doanh thu theo tháng, tỷ lệ học viên theo khóa, tình trạng đóng học phí).
   - **CRUD Khóa học**: Thêm, sửa, xóa, tìm kiếm, lọc.
   - **CRUD Học viên**: Mã HV, ngày sinh, SĐT, Email, phân lớp, tự động tính tổng học phí, đã đóng và còn thiếu (`Còn thiếu = Tổng - Đã đóng`), xuất Excel danh sách học viên.
   - **CRUD Giảng viên**: Ảnh đại diện, chuyên môn, ngôn ngữ giảng dạy, đếm số lớp phụ trách.
   - **CRUD Lớp học**: Gán giảng viên, gán học viên, quản lý sức chứa tối đa, xem danh sách học viên trong từng lớp.
   - **Quản lý Lịch học Calendar**: Xem thời khóa biểu theo chế độ Ngày / Tuần / Tháng, thêm/sửa ca học.
   - **Quản lý Học phí**: Theo dõi từng đợt thanh toán, lưu vết giao dịch, xuất báo cáo tài chính Excel.
   - **Quản lý Kết quả học tập**: Nhập điểm Kiểm tra (20%), Giữa kỳ (30%), Cuối kỳ (50%) -> Tự động tính Điểm tổng kết và xếp loại học viên (Xuất sắc, Tốt, Khá, Trung bình, Chưa đạt).
   - **Theo dõi Tiến độ học tập**: Hiển thị Progress Bar phần trăm hoàn thành và tỷ lệ chuyên cần.
   - **Quản lý Đăng ký**: Tiếp nhận yêu cầu tư vấn từ Website Public, cập nhật trạng thái (Mới, Đã tư vấn, Đã đăng ký).
   - **Báo cáo & Xuất Excel**: Xuất file `.xlsx` danh sách học viên và báo cáo học phí.

---

## 🔗 Danh sách RESTful API chính

| Method | Endpoint | Mô tả | Authorization |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Đăng nhập tài khoản Admin | Public |
| `GET` | `/api/auth/me` | Lấy thông tin tài khoản hiện tại | Bearer JWT |
| `GET` | `/api/courses` | Lấy danh sách khóa học (kèm filter/search/sort) | Public |
| `POST` | `/api/courses` | Tạo khóa học mới | Admin |
| `PUT` | `/api/courses/{id}` | Cập nhật khóa học | Admin |
| `DELETE` | `/api/courses/{id}` | Xóa khóa học | Admin |
| `GET` | `/api/teachers` | Lấy danh sách giảng viên | Public |
| `GET` | `/api/classes` | Lấy danh sách lớp học | Public |
| `GET` | `/api/students` | Lấy danh sách học viên (có phân trang & filter) | Public/Admin |
| `POST` | `/api/registrations` | Gửi đăng ký tư vấn từ Public Website | Public |
| `GET` | `/api/schedules` | Lấy lịch học dạng Calendar | Public |
| `POST` | `/api/payments` | Ghi nhận đợt đóng học phí | Admin |
| `POST` | `/api/results` | Cập nhật điểm & tự động xếp loại học viên | Admin |
| `GET` | `/api/dashboard` | Lấy dữ liệu thống kê & biểu đồ Dashboard | Admin |
| `GET` | `/api/export/students` | Xuất file Excel danh sách học viên | Admin/Staff |
| `GET` | `/api/export/payments` | Xuất file Excel báo cáo học phí | Admin/Staff |
