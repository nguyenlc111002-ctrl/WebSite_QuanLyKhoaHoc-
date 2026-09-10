using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.DTOs;

public class ResultDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public string CourseTitle { get; set; } = string.Empty;
    public decimal QuizScore { get; set; }
    public decimal MidtermScore { get; set; }
    public decimal FinalScore { get; set; }
    public decimal TotalScore { get; set; }
    public string Grade { get; set; } = string.Empty;
    public string Comments { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
}

public class CreateUpdateResultDto
{
    [Required(ErrorMessage = "Vui lòng chọn học viên")]
    public int StudentId { get; set; }

    [Required(ErrorMessage = "Vui lòng chọn lớp học")]
    public int ClassId { get; set; }

    [Range(0, 10, ErrorMessage = "Điểm kiểm tra từ 0 đến 10")]
    public decimal QuizScore { get; set; }

    [Range(0, 10, ErrorMessage = "Điểm giữa kỳ từ 0 đến 10")]
    public decimal MidtermScore { get; set; }

    [Range(0, 10, ErrorMessage = "Điểm cuối kỳ từ 0 đến 10")]
    public decimal FinalScore { get; set; }

    public string Comments { get; set; } = string.Empty;
}
