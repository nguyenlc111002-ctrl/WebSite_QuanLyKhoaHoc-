using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebSite_QuanLyKhoaHoc.Models;

public class Result
{
    public int Id { get; set; }

    public int StudentId { get; set; }
    public Student? Student { get; set; }

    public int ClassId { get; set; }
    public Class? Class { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal QuizScore { get; set; } // Điểm kiểm tra

    [Column(TypeName = "decimal(5,2)")]
    public decimal MidtermScore { get; set; } // Điểm giữa kỳ

    [Column(TypeName = "decimal(5,2)")]
    public decimal FinalScore { get; set; } // Điểm cuối kỳ

    [Column(TypeName = "decimal(5,2)")]
    public decimal TotalScore { get; set; } // Điểm tổng kết (Auto-calculated: 0.2*Quiz + 0.3*Midterm + 0.5*Final)

    [MaxLength(50)]
    public string Grade { get; set; } = "Khá"; // Xuất sắc, Tốt, Khá, Trung bình, Chưa đạt

    public string Comments { get; set; } = string.Empty; // Nhận xét

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
