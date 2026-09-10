using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.Models;

public class Registration
{
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    public int CourseId { get; set; }
    public Course? Course { get; set; }

    public string Notes { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Mới"; // Mới, Đã liên hệ, Đã tư vấn, Đã đăng ký, Đã hủy

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
