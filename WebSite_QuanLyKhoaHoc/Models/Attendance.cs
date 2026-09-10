using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.Models;

public class Attendance
{
    public int Id { get; set; }

    public int StudentId { get; set; }
    public Student? Student { get; set; }

    public int ScheduleId { get; set; }
    public Schedule? Schedule { get; set; }

    public bool IsPresent { get; set; } = true;

    public string Note { get; set; } = string.Empty;
}
