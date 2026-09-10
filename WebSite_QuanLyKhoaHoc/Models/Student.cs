using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.Models;

public class Student
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    [MaxLength(20)]
    public string Gender { get; set; } = "Nam"; // Nam, Nữ, Khác

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

    public int? ClassId { get; set; }
    public Class? Class { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Đang học"; // Đang học, Đã hoàn thành, Bảo lưu, Nghỉ học

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<Result> Results { get; set; } = new List<Result>();
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}
