using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Models;
using WebSite_QuanLyKhoaHoc.Services;

namespace WebSite_QuanLyKhoaHoc.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, IPasswordHasher hasher)
    {
        await context.Database.EnsureCreatedAsync();

        // 1. Seed Users
        if (!await context.Users.AnyAsync())
        {
            var admin = new User
            {
                Username = "admin",
                Email = "admin@viethan.edu.vn",
                FullName = "Quản Trị Viên Hệ Thống",
                PasswordHash = hasher.HashPassword("Admin@123456"),
                Role = "SUPER_ADMIN",
                CreatedAt = DateTime.UtcNow
            };

            var staff = new User
            {
                Username = "staff",
                Email = "staff@viethan.edu.vn",
                FullName = "Nhân Viên Tư Vấn",
                PasswordHash = hasher.HashPassword("Staff@123456"),
                Role = "STAFF",
                CreatedAt = DateTime.UtcNow
            };

            await context.Users.AddRangeAsync(admin, staff);
            await context.SaveChangesAsync();
        }

        // 2. Seed Courses
        if (!await context.Courses.AnyAsync())
        {
            var courses = new List<Course>
            {
                new Course
                {
                    Code = "KOR-101",
                    Title = "Tiếng Hàn Sơ Cấp 1 (Dành Cho Người Mới Bắt Đầu)",
                    Language = "Tiếng Hàn",
                    Level = "Sơ cấp",
                    Description = "Khóa học nền tảng giúp làm quen với bảng chữ cái Hangeul, giao tiếp cơ bản hàng ngày, phát âm chuẩn giọng Seoul.",
                    TuitionFee = 2500000,
                    Duration = "2.5 tháng (30 buổi)",
                    ImageUrl = "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
                    Status = "Đang mở đăng ký",
                    CreatedAt = DateTime.UtcNow
                },
                new Course
                {
                    Code = "KOR-TPK",
                    Title = "Luyện Thi TOPIK II (Cấp 3 - 4 - 5)",
                    Language = "Tiếng Hàn",
                    Level = "TOPIK II",
                    Description = "Chương trình chuyên sâu luyện giải đề thi TOPIK II, chiến thuật làm bài Đọc - Nghe - Viết chuẩn format mới nhất.",
                    TuitionFee = 4200000,
                    Duration = "3.5 tháng (42 buổi)",
                    ImageUrl = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
                    Status = "Đang mở đăng ký",
                    CreatedAt = DateTime.UtcNow
                },
                new Course
                {
                    Code = "ENG-COM",
                    Title = "Tiếng Anh Giao Tiếp Phản Xạ Nhanh",
                    Language = "Tiếng Anh",
                    Level = "Trung cấp",
                    Description = "Rèn luyện phản xạ phát âm chuẩn IPA, làm chủ hơn 50 chủ đề giao tiếp công sở, đời sống và phỏng vấn xin việc.",
                    TuitionFee = 3000000,
                    Duration = "3 tháng (36 buổi)",
                    ImageUrl = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
                    Status = "Đang mở đăng ký",
                    CreatedAt = DateTime.UtcNow
                },
                new Course
                {
                    Code = "ENG-IELTS",
                    Title = "Luyện Thi IELTS Intensive 6.5+",
                    Language = "Tiếng Anh",
                    Level = "IELTS",
                    Description = "Khóa luyện thi cấp tốc tập trung 4 kỹ năng Nghe - Nói - Đọc - Viết với giảng viên 8.5 IELTS và GV Bản ngữ.",
                    TuitionFee = 5800000,
                    Duration = "4 tháng (48 buổi)",
                    ImageUrl = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
                    Status = "Đang mở đăng ký",
                    CreatedAt = DateTime.UtcNow
                },
                new Course
                {
                    Code = "JPN-N4",
                    Title = "Tiếng Nhật Cấp Tốc N4 - N5",
                    Language = "Tiếng Nhật",
                    Level = "Sơ cấp",
                    Description = "Học thuộc 500 từ vựng Kanji, cấu trúc ngữ pháp N4/N5 và thực hành giao tiếp hội thoại cơ bản với người bản xứ.",
                    TuitionFee = 3200000,
                    Duration = "3 tháng (36 buổi)",
                    ImageUrl = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
                    Status = "Đang học",
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Courses.AddRangeAsync(courses);
            await context.SaveChangesAsync();
        }

        // 3. Seed Teachers
        if (!await context.Teachers.AnyAsync())
        {
            var teachers = new List<Teacher>
            {
                new Teacher
                {
                    Code = "GV-KOR01",
                    FullName = "Park Ji-Min",
                    AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
                    TeachingLanguage = "Tiếng Hàn",
                    Specialization = "Thạc sĩ Ngôn ngữ Đại học Seoul (SNU)",
                    Phone = "0988123456",
                    Email = "parkjimin@viethan.edu.vn",
                    Experience = "7 năm kinh nghiệm",
                    Description = "Chuyên gia giảng dạy tiếng Hàn giao tiếp và TOPIK cao cấp với phương pháp trực quan sinh động.",
                    Status = "Đang giảng dạy"
                },
                new Teacher
                {
                    Code = "GV-KOR02",
                    FullName = "Nguyễn Thị Thu Hà",
                    AvatarUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
                    TeachingLanguage = "Tiếng Hàn",
                    Specialization = "TOPIK Cấp 6 - Biên phiên dịch viên",
                    Phone = "0912345678",
                    Email = "thuha@viethan.edu.vn",
                    Experience = "5 năm kinh nghiệm",
                    Description = "Nhiệt tình, tỉ mỉ, hỗ trợ từng học viên nắm chắc ngữ pháp và phát âm tiếng Hàn.",
                    Status = "Đang giảng dạy"
                },
                new Teacher
                {
                    Code = "GV-ENG01",
                    FullName = "David Mark Harrison",
                    AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
                    TeachingLanguage = "Tiếng Anh",
                    Specialization = "Cử nhân Sư phạm Anh (TESOL UK)",
                    Phone = "0933999888",
                    Email = "david.harrison@viethan.edu.vn",
                    Experience = "8 năm kinh nghiệm",
                    Description = "Giảng viên bản ngữ giàu năng lượng, chuyên luyện phản xạ giao tiếp tiếng Anh công sở.",
                    Status = "Đang giảng dạy"
                },
                new Teacher
                {
                    Code = "GV-ENG02",
                    FullName = "Trần Minh Khoa",
                    AvatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
                    TeachingLanguage = "Tiếng Anh",
                    Specialization = "IELTS Overall 8.5 (Reading 9.0, Writing 8.5)",
                    Phone = "0905111222",
                    Email = "minhkhoa@viethan.edu.vn",
                    Experience = "6 năm kinh nghiệm",
                    Description = "Chuyên gia phân tích dạng bài IELTS, cựu sinh viên xuất sắc Đại học Quốc Gia.",
                    Status = "Đang giảng dạy"
                },
                new Teacher
                {
                    Code = "GV-JPN01",
                    FullName = "Sato Kenji",
                    AvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
                    TeachingLanguage = "Tiếng Nhật",
                    Specialization = "JLPT N1 Native Speaker",
                    Phone = "0977444555",
                    Email = "kenji.sato@viethan.edu.vn",
                    Experience = "4 năm kinh nghiệm",
                    Description = "Thân thiện, giúp học viên tiếp thu tiếng Nhật tự nhiên qua văn hóa và trải nghiệm thực tế.",
                    Status = "Đang giảng dạy"
                }
            };

            await context.Teachers.AddRangeAsync(teachers);
            await context.SaveChangesAsync();
        }

        // 4. Seed Classes
        if (!await context.Classes.AnyAsync())
        {
            var kor1 = await context.Courses.FirstAsync(c => c.Code == "KOR-101");
            var korTopik = await context.Courses.FirstAsync(c => c.Code == "KOR-TPK");
            var engCom = await context.Courses.FirstAsync(c => c.Code == "ENG-COM");
            var engIelts = await context.Courses.FirstAsync(c => c.Code == "ENG-IELTS");

            var t1 = await context.Teachers.FirstAsync(t => t.Code == "GV-KOR01");
            var t2 = await context.Teachers.FirstAsync(t => t.Code == "GV-KOR02");
            var t3 = await context.Teachers.FirstAsync(t => t.Code == "GV-ENG01");
            var t4 = await context.Teachers.FirstAsync(t => t.Code == "GV-ENG02");

            var classes = new List<Class>
            {
                new Class
                {
                    Code = "LH-KOR101-01",
                    Name = "Lớp Tiếng Hàn Sơ Cấp K101-01",
                    CourseId = kor1.Id,
                    TeacherId = t1.Id,
                    Room = "Phòng A.201",
                    StartDate = DateTime.Today.AddDays(-15),
                    EndDate = DateTime.Today.AddDays(60),
                    StudyHours = "18:00 - 19:30",
                    WeeklySchedule = "Thứ 2 - Thứ 4 - Thứ 6",
                    Capacity = 20,
                    Status = "Đang học"
                },
                new Class
                {
                    Code = "LH-KOR101-02",
                    Name = "Lớp Tiếng Hàn Sơ Cấp K101-02",
                    CourseId = kor1.Id,
                    TeacherId = t2.Id,
                    Room = "Phòng A.202",
                    StartDate = DateTime.Today.AddDays(10),
                    EndDate = DateTime.Today.AddDays(85),
                    StudyHours = "19:45 - 21:15",
                    WeeklySchedule = "Thứ 3 - Thứ 5 - Thứ 7",
                    Capacity = 20,
                    Status = "Sắp khai giảng"
                },
                new Class
                {
                    Code = "LH-TOPIK-01",
                    Name = "Lớp Luyện Thi TOPIK II K01",
                    CourseId = korTopik.Id,
                    TeacherId = t1.Id,
                    Room = "Phòng B.103",
                    StartDate = DateTime.Today.AddDays(-30),
                    EndDate = DateTime.Today.AddDays(75),
                    StudyHours = "18:00 - 20:00",
                    WeeklySchedule = "Thứ 3 - Thứ 5 - Chủ Nhật",
                    Capacity = 15,
                    Status = "Đang học"
                },
                new Class
                {
                    Code = "LH-ENGCOM-01",
                    Name = "Lớp Giao Tiếp Tiếng Anh EC-01",
                    CourseId = engCom.Id,
                    TeacherId = t3.Id,
                    Room = "Phòng C.301",
                    StartDate = DateTime.Today.AddDays(-10),
                    EndDate = DateTime.Today.AddDays(80),
                    StudyHours = "18:30 - 20:00",
                    WeeklySchedule = "Thứ 2 - Thứ 4 - Thứ 6",
                    Capacity = 18,
                    Status = "Đang học"
                },
                new Class
                {
                    Code = "LH-IELTS-01",
                    Name = "Lớp IELTS Intensive 6.5+ IT-01",
                    CourseId = engIelts.Id,
                    TeacherId = t4.Id,
                    Room = "Phòng C.305",
                    StartDate = DateTime.Today.AddDays(-40),
                    EndDate = DateTime.Today.AddDays(80),
                    StudyHours = "19:30 - 21:30",
                    WeeklySchedule = "Thứ 2 - Thứ 4 - Thứ 6",
                    Capacity = 12,
                    Status = "Đang học"
                }
            };

            await context.Classes.AddRangeAsync(classes);
            await context.SaveChangesAsync();
        }

        // 5. Seed Students
        if (!await context.Students.AnyAsync())
        {
            var clsKor1 = await context.Classes.FirstAsync(c => c.Code == "LH-KOR101-01");
            var clsTopik = await context.Classes.FirstAsync(c => c.Code == "LH-TOPIK-01");
            var clsEng = await context.Classes.FirstAsync(c => c.Code == "LH-ENGCOM-01");
            var clsIelts = await context.Classes.FirstAsync(c => c.Code == "LH-IELTS-01");

            var students = new List<Student>
            {
                new Student
                {
                    Code = "083202010672",
                    FullName = "Lê Chí Nguyên",
                    DateOfBirth = new DateTime(2002, 10, 11),
                    Gender = "Nam",
                    Phone = "0332 789 835",
                    Email = "Chinguyenle111002@gmail.com",
                    Address = "Ấp Lộc Thới, xã Lộc Thuận, tỉnh Vĩnh Long",
                    RegistrationDate = DateTime.Today.AddDays(-20),
                    ClassId = clsKor1.Id,
                    Status = "Đang học"
                },
                new Student
                {
                    Code = "HV2026002",
                    FullName = "Le Thi Mai",
                    DateOfBirth = new DateTime(2001, 8, 22),
                    Gender = "Nữ",
                    Phone = "0988333444",
                    Email = "lethimai@gmail.com",
                    Address = "45 Lê Duẩn, Q. Hải Châu, Đà Nẵng",
                    RegistrationDate = DateTime.Today.AddDays(-18),
                    ClassId = clsKor1.Id,
                    Status = "Đang học"
                },
                new Student
                {
                    Code = "HV2026003",
                    FullName = "Tran Minh Tu",
                    DateOfBirth = new DateTime(2000, 3, 10),
                    Gender = "Nam",
                    Phone = "0935555666",
                    Email = "tranminhtu@gmail.com",
                    Address = "78 Điện Biên Phủ, Đà Nẵng",
                    RegistrationDate = DateTime.Today.AddDays(-35),
                    ClassId = clsTopik.Id,
                    Status = "Đang học"
                },
                new Student
                {
                    Code = "HV2026004",
                    FullName = "Pham Hong Hanh",
                    DateOfBirth = new DateTime(2003, 11, 5),
                    Gender = "Nữ",
                    Phone = "0905777888",
                    Email = "honghanh@gmail.com",
                    Address = "12 Trần Phú, Đà Nẵng",
                    RegistrationDate = DateTime.Today.AddDays(-12),
                    ClassId = clsEng.Id,
                    Status = "Đang học"
                },
                new Student
                {
                    Code = "HV2026005",
                    FullName = "Vũ Hoàng Long",
                    DateOfBirth = new DateTime(1999, 12, 18),
                    Gender = "Nam",
                    Phone = "0914999000",
                    Email = "hoanglong.vu@gmail.com",
                    Address = "99 Hùng Vương, Đà Nẵng",
                    RegistrationDate = DateTime.Today.AddDays(-45),
                    ClassId = clsIelts.Id,
                    Status = "Đang học"
                },
                new Student
                {
                    Code = "HV2026006",
                    FullName = "Đặng Thùy Dương",
                    DateOfBirth = new DateTime(2004, 2, 14),
                    Gender = "Nữ",
                    Phone = "0982112233",
                    Email = "thuyduong.dang@gmail.com",
                    Address = "234 Ngô Quyền, Đà Nẵng",
                    RegistrationDate = DateTime.Today.AddDays(-15),
                    ClassId = clsKor1.Id,
                    Status = "Đang học"
                },
                new Student
                {
                    Code = "HV2026007",
                    FullName = "Bùi Anh Tuấn",
                    DateOfBirth = new DateTime(2002, 9, 30),
                    Gender = "Nam",
                    Phone = "0934445566",
                    Email = "anhtuan.bui@gmail.com",
                    Address = "56 Nguyễn Hữu Thọ, Đà Nẵng",
                    RegistrationDate = DateTime.Today.AddDays(-10),
                    ClassId = clsEng.Id,
                    Status = "Đang học"
                },
                new Student
                {
                    Code = "HV2026008",
                    FullName = "Hoàng Phương Thảo",
                    DateOfBirth = new DateTime(2001, 7, 7),
                    Gender = "Nữ",
                    Phone = "0906123789",
                    Email = "phuongthao@gmail.com",
                    Address = "88 2 Tháng 9, Đà Nẵng",
                    RegistrationDate = DateTime.Today.AddDays(-32),
                    ClassId = clsTopik.Id,
                    Status = "Đang học"
                },
                new Student
                {
                    Code = "HV2026009",
                    FullName = "Đỗ Quốc Bảo",
                    DateOfBirth = new DateTime(2000, 4, 25),
                    Gender = "Nam",
                    Phone = "0978889900",
                    Email = "quocbao.do@gmail.com",
                    Address = "15 Tôn Đức Thắng, Đà Nẵng",
                    RegistrationDate = DateTime.Today.AddDays(-5),
                    ClassId = null,
                    Status = "Bảo lưu"
                },
                new Student
                {
                    Code = "HV2026010",
                    FullName = "Nguyễn Ngọc Lan",
                    DateOfBirth = new DateTime(2003, 10, 12),
                    Gender = "Nữ",
                    Phone = "0918776655",
                    Email = "ngoclan.nguyen@gmail.com",
                    Address = "300 Trường Chinh, Đà Nẵng",
                    RegistrationDate = DateTime.Today.AddDays(-60),
                    ClassId = clsIelts.Id,
                    Status = "Đã hoàn thành"
                }
            };

            await context.Students.AddRangeAsync(students);
            await context.SaveChangesAsync();
        }

        // 6. Seed Payments
        if (!await context.Payments.AnyAsync())
        {
            var st1 = await context.Students.FirstAsync(s => s.Code == "083202010672");
            var st2 = await context.Students.FirstAsync(s => s.Code == "HV2026002");
            var st3 = await context.Students.FirstAsync(s => s.Code == "HV2026003");
            var st4 = await context.Students.FirstAsync(s => s.Code == "HV2026004");
            var st5 = await context.Students.FirstAsync(s => s.Code == "HV2026005");

            var cKor1 = await context.Courses.FirstAsync(c => c.Code == "KOR-101");
            var cTopik = await context.Courses.FirstAsync(c => c.Code == "KOR-TPK");
            var cEng = await context.Courses.FirstAsync(c => c.Code == "ENG-COM");
            var cIelts = await context.Courses.FirstAsync(c => c.Code == "ENG-IELTS");

            var payments = new List<Payment>
            {
                new Payment
                {
                    StudentId = st1.Id,
                    CourseId = cKor1.Id,
                    AmountPaid = 2500000,
                    PaymentDate = DateTime.Today.AddDays(-19),
                    PaymentMethod = "Chuyển khoản",
                    Notes = "Đã hoàn thành full học phí"
                },
                new Payment
                {
                    StudentId = st2.Id,
                    CourseId = cKor1.Id,
                    AmountPaid = 1500000,
                    PaymentDate = DateTime.Today.AddDays(-18),
                    PaymentMethod = "Tiền mặt",
                    Notes = "Đóng đợt 1 (Còn thiếu 1,000,000 VNĐ)"
                },
                new Payment
                {
                    StudentId = st3.Id,
                    CourseId = cTopik.Id,
                    AmountPaid = 4200000,
                    PaymentDate = DateTime.Today.AddDays(-34),
                    PaymentMethod = "Chuyển khoản",
                    Notes = "Đã thanh toán đủ"
                },
                new Payment
                {
                    StudentId = st4.Id,
                    CourseId = cEng.Id,
                    AmountPaid = 3000000,
                    PaymentDate = DateTime.Today.AddDays(-11),
                    PaymentMethod = "Thẻ",
                    Notes = "Đã thanh toán đủ"
                },
                new Payment
                {
                    StudentId = st5.Id,
                    CourseId = cIelts.Id,
                    AmountPaid = 3000000,
                    PaymentDate = DateTime.Today.AddDays(-44),
                    PaymentMethod = "Chuyển khoản",
                    Notes = "Đóng đợt 1 (Còn thiếu 2,800,000 VNĐ)"
                }
            };

            await context.Payments.AddRangeAsync(payments);
            await context.SaveChangesAsync();
        }

        // 7. Seed Results
        if (!await context.Results.AnyAsync())
        {
            var st1 = await context.Students.FirstAsync(s => s.Code == "083202010672");
            var st3 = await context.Students.FirstAsync(s => s.Code == "HV2026003");
            var st5 = await context.Students.FirstAsync(s => s.Code == "HV2026005");

            var clsKor1 = await context.Classes.FirstAsync(c => c.Code == "LH-KOR101-01");
            var clsTopik = await context.Classes.FirstAsync(c => c.Code == "LH-TOPIK-01");
            var clsIelts = await context.Classes.FirstAsync(c => c.Code == "LH-IELTS-01");

            var results = new List<Result>
            {
                new Result
                {
                    StudentId = st1.Id,
                    ClassId = clsKor1.Id,
                    QuizScore = 8.5m,
                    MidtermScore = 9.0m,
                    FinalScore = 8.8m,
                    TotalScore = 8.8m, // (8.5*0.2 + 9*0.3 + 8.8*0.5) = 1.7 + 2.7 + 4.4 = 8.8
                    Grade = "Xuất sắc",
                    Comments = "Học viên tiếp thu rất nhanh, phát âm chuẩn, tích cực phát biểu.",
                    UpdatedAt = DateTime.UtcNow
                },
                new Result
                {
                    StudentId = st3.Id,
                    ClassId = clsTopik.Id,
                    QuizScore = 7.5m,
                    MidtermScore = 8.0m,
                    FinalScore = 7.8m,
                    TotalScore = 7.8m,
                    Grade = "Tốt",
                    Comments = "Ngữ pháp vững, cần rèn luyện thêm kỹ năng làm bài viết TOPIK.",
                    UpdatedAt = DateTime.UtcNow
                },
                new Result
                {
                    StudentId = st5.Id,
                    ClassId = clsIelts.Id,
                    QuizScore = 6.5m,
                    MidtermScore = 7.0m,
                    FinalScore = 7.0m,
                    TotalScore = 6.9m,
                    Grade = "Khá",
                    Comments = "Kỹ năng Reading xuất sắc, Listening và Speaking có tiến bộ rõ rệt.",
                    UpdatedAt = DateTime.UtcNow
                }
            };

            await context.Results.AddRangeAsync(results);
            await context.SaveChangesAsync();
        }

        // 8. Seed Registrations (submitted from public website)
        if (!await context.Registrations.AnyAsync())
        {
            var kor1 = await context.Courses.FirstAsync(c => c.Code == "KOR-101");
            var engIelts = await context.Courses.FirstAsync(c => c.Code == "ENG-IELTS");

            var registrations = new List<Registration>
            {
                new Registration
                {
                    FullName = "Nguyễn Hoàng Nam",
                    Phone = "0905123999",
                    Email = "hoangnam@gmail.com",
                    CourseId = kor1.Id,
                    Notes = "Muốn tư vấn lịch học buổi tối thứ 2-4-6",
                    Status = "Mới",
                    CreatedAt = DateTime.UtcNow.AddHours(-3)
                },
                new Registration
                {
                    FullName = "Trần Thị Thu Thảo",
                    Phone = "0988777111",
                    Email = "thuthao.tran@gmail.com",
                    CourseId = engIelts.Id,
                    Notes = "Cần tư vấn xếp lớp thi mục tiêu 7.0 trong 6 tháng",
                    Status = "Đã tư vấn",
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            await context.Registrations.AddRangeAsync(registrations);
            await context.SaveChangesAsync();
        }

        // 9. Seed Schedules
        if (!await context.Schedules.AnyAsync())
        {
            var clsKor1 = await context.Classes.FirstAsync(c => c.Code == "LH-KOR101-01");
            var clsEng = await context.Classes.FirstAsync(c => c.Code == "LH-ENGCOM-01");

            var schedules = new List<Schedule>
            {
                new Schedule
                {
                    ClassId = clsKor1.Id,
                    Date = DateTime.Today,
                    StartTime = "18:00",
                    EndTime = "19:30",
                    Room = "Phòng A.201",
                    Note = "Bài 5: Từ vựng mua sắm & Ngữ pháp V-아/어 주세요"
                },
                new Schedule
                {
                    ClassId = clsKor1.Id,
                    Date = DateTime.Today.AddDays(2),
                    StartTime = "18:00",
                    EndTime = "19:30",
                    Room = "Phòng A.201",
                    Note = "Bài 6: Ngữ pháp V-고 싶다 & Luyện nghe hội thoại"
                },
                new Schedule
                {
                    ClassId = clsEng.Id,
                    Date = DateTime.Today,
                    StartTime = "18:30",
                    EndTime = "20:00",
                    Room = "Phòng C.301",
                    Note = "Topic: Business Communication & Email Writing"
                }
            };

            await context.Schedules.AddRangeAsync(schedules);
            await context.SaveChangesAsync();
        }
    }
}
