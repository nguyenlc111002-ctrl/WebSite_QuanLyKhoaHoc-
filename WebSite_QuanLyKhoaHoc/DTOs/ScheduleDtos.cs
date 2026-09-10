using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.DTOs;

public class ScheduleDto
{
    public int Id { get; set; }
    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public string ClassCode { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string Room { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
}

public class CreateUpdateScheduleDto
{
    [Required(ErrorMessage = "Vui lòng chọn lớp học")]
    public int ClassId { get; set; }

    [Required(ErrorMessage = "Ngày học không được để trống")]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "Giờ bắt đầu không được để trống")]
    public string StartTime { get; set; } = "18:00";

    [Required(ErrorMessage = "Giờ kết thúc không được để trống")]
    public string EndTime { get; set; } = "19:30";

    public string Room { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
}
