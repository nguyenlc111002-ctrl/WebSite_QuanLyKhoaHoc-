namespace WebSite_QuanLyKhoaHoc.DTOs;

public class DashboardSummaryDto
{
    public int TotalCourses { get; set; }
    public int TotalStudents { get; set; }
    public int TotalTeachers { get; set; }
    public int TotalClasses { get; set; }
    public int ActiveClasses { get; set; }
    public int ActiveStudents { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal PendingTuition { get; set; }
    public int TotalRegistrations { get; set; }
    public int PendingRegistrations { get; set; }

    public List<MonthlyRevenueDto> MonthlyRevenue { get; set; } = new();
    public List<CourseStudentCountDto> StudentsPerCourse { get; set; } = new();
    public List<StatusCountDto> PaymentStatusDistribution { get; set; } = new();
    public List<StatusCountDto> StudentStatusDistribution { get; set; } = new();
}

public class MonthlyRevenueDto
{
    public string Month { get; set; } = string.Empty; // e.g. "T01/2026"
    public decimal Revenue { get; set; }
    public int StudentCount { get; set; }
}

public class CourseStudentCountDto
{
    public string CourseName { get; set; } = string.Empty;
    public int StudentCount { get; set; }
}

public class StatusCountDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}
