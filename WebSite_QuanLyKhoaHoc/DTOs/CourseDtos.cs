using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.DTOs;

public class CourseDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal TuitionFee { get; set; }
    public string Duration { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public int TotalClassesCount { get; set; }
    public int TotalStudentsCount { get; set; }
}

public class CreateUpdateCourseDto
{
    [Required(ErrorMessage = "Mã khóa học không được để trống")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên khóa học không được để trống")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ngôn ngữ không được để trống")]
    public string Language { get; set; } = string.Empty;

    [Required(ErrorMessage = "Trình độ không được để trống")]
    public string Level { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Range(0, 100000000, ErrorMessage = "Học phí phải là số lớn hơn hoặc bằng 0")]
    public decimal TuitionFee { get; set; }

    public string Duration { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public string Status { get; set; } = "Đang mở đăng ký";
}
