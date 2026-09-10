using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_QuanLyKhoaHoc.Models;

public class Course
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Language { get; set; } = string.Empty; // Tiếng Hàn, Tiếng Anh, Tiếng Nhật, Tiếng Trung...

    [Required]
    [MaxLength(100)]
    public string Level { get; set; } = string.Empty; // Sơ cấp, Trung cấp, Cao cấp, TOPIK I, TOPIK II, IELTS...

    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal TuitionFee { get; set; }

    [MaxLength(100)]
    public string Duration { get; set; } = string.Empty; // e.g. "3 tháng (48 tiết)"

    public string ImageUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Đang mở đăng ký"; // Đang mở đăng ký, Đang học, Đã kết thúc, Tạm dừng

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Class> Classes { get; set; } = new List<Class>();
    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
}
