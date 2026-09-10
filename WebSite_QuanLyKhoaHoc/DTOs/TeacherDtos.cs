using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.DTOs;

public class TeacherDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string TeachingLanguage { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public int TotalActiveClasses { get; set; }
}

public class CreateUpdateTeacherDto
{
    [Required(ErrorMessage = "Mã giảng viên không được để trống")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "Họ tên giảng viên không được để trống")]
    public string FullName { get; set; } = string.Empty;

    public string AvatarUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ngôn ngữ giảng dạy không được để trống")]
    public string TeachingLanguage { get; set; } = string.Empty;

    public string Specialization { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số điện thoại không được để trống")]
    [Phone(ErrorMessage = "Số điện thoại không đúng định dạng")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
    public string Email { get; set; } = string.Empty;

    public string Experience { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public string Status { get; set; } = "Đang giảng dạy";
}
