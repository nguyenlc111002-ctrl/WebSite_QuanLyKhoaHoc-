using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.Models;

public class Schedule
{
    public int Id { get; set; }

    public int ClassId { get; set; }
    public Class? Class { get; set; }

    public DateTime Date { get; set; }

    [Required]
    [MaxLength(20)]
    public string StartTime { get; set; } = "18:00";

    [Required]
    [MaxLength(20)]
    public string EndTime { get; set; } = "19:30";

    [MaxLength(100)]
    public string Room { get; set; } = string.Empty;

    public string Note { get; set; } = string.Empty;

    // Navigation
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}
