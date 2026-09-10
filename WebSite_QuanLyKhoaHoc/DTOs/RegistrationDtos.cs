using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.DTOs;

public class RegistrationDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public decimal CourseFee { get; set; }
    public string Notes { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Mới, Đã liên hệ, Đã tư vấn, Đã đăng ký, Đã hủy
    public DateTime CreatedAt { get; set; }
}

public class CreateRegistrationDto
{
    [Required(ErrorMessage = "Họ và tên không được để trống")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [Phone(ErrorMessage = "Số điện thoại không đúng định dạng")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng chọn khóa học")]
    public int CourseId { get; set; }

    public string Notes { get; set; } = string.Empty;
}

public class UpdateRegistrationStatusDto
{
    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public string Status { get; set; } = "Đã liên hệ";
}
