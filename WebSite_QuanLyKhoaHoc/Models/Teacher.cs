using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.Models;

public class Teacher
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    public string AvatarUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string TeachingLanguage { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Specialization { get; set; } = string.Empty; // Chuyên môn: Thạc sĩ Ngôn ngữ Hàn, IELTS 8.5...

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Experience { get; set; } = string.Empty; // e.g. "5 năm kinh nghiệm"

    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Đang giảng dạy"; // Đang giảng dạy, Tạm nghỉ

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Class> Classes { get; set; } = new List<Class>();
}
