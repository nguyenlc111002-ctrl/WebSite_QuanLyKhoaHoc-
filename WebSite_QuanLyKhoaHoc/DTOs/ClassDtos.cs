using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.DTOs;

public class ClassDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string CourseLanguage { get; set; } = string.Empty;
    public int? TeacherId { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public string TeacherAvatar { get; set; } = string.Empty;
    public string Room { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string StudyHours { get; set; } = string.Empty;
    public string WeeklySchedule { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public int CurrentStudentCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateUpdateClassDto
{
    [Required(ErrorMessage = "Mã lớp không được để trống")]
    public string Code { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên lớp không được để trống")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng chọn khóa học")]
    public int CourseId { get; set; }

    public int? TeacherId { get; set; }

    public string Room { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ngày bắt đầu không được để trống")]
    public DateTime StartDate { get; set; }

    [Required(ErrorMessage = "Ngày kết thúc không được để trống")]
    public DateTime EndDate { get; set; }

    public string StudyHours { get; set; } = "18:00 - 19:30";
    public string WeeklySchedule { get; set; } = "Thứ 2 - Thứ 4 - Thứ 6";

    [Range(1, 100, ErrorMessage = "Sức chứa lớp học phải từ 1 đến 100")]
    public int Capacity { get; set; } = 20;

    [Required(ErrorMessage = "Trạng thái không được để trống")]
    public string Status { get; set; } = "Sắp khai giảng";
}
