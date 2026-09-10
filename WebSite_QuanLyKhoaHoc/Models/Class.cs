using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.Models;

public class Class
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    public int CourseId { get; set; }
    public Course? Course { get; set; }

    public int? TeacherId { get; set; }
    public Teacher? Teacher { get; set; }

    [MaxLength(100)]
    public string Room { get; set; } = string.Empty; // Phòng A101

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    [MaxLength(100)]
    public string StudyHours { get; set; } = string.Empty; // e.g. "18:00 - 19:30"

    [MaxLength(100)]
    public string WeeklySchedule { get; set; } = string.Empty; // e.g. "Thứ 2 - 4 - 6"

    public int Capacity { get; set; } = 20;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Sắp khai giảng"; // Sắp khai giảng, Đang học, Đã kết thúc, Tạm dừng

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Student> Students { get; set; } = new List<Student>();
    public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    public ICollection<Result> Results { get; set; } = new List<Result>();
}
