using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.DTOs;

public class StudentDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }

    public int? ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public int? CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;

    public decimal TotalFee { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal RemainingFee { get; set; } // TotalFee - PaidAmount
    public string PaymentStatus { get; set; } = string.Empty; // Chưa đóng, Đã đóng 1 phần, Đã thanh toán đủ

    public string LearningResult { get; set; } = string.Empty;
    public decimal? TotalScore { get; set; }
    public int AttendanceRate { get; set; } // 0 to 100%

    public string Status { get; set; } = string.Empty; // Đang học, Đã hoàn thành, Bảo lưu, Nghỉ học
    public DateTime CreatedAt { get; set; }
}

public class CreateUpdateStudentDto
{
    [Required(ErrorMessage = "Mã học viên không được để trống")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "Họ tên học viên không được để trống")]
    public string FullName { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = "Nam";

    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;
    public int? ClassId { get; set; }

    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public string Status { get; set; } = "Đang học";
}
