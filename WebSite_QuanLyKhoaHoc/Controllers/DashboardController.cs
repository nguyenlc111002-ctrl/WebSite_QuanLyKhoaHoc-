using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Data;
using WebSite_QuanLyKhoaHoc.DTOs;

namespace WebSite_QuanLyKhoaHoc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        var totalCourses = await _context.Courses.CountAsync();
        var totalStudents = await _context.Students.CountAsync();
        var totalTeachers = await _context.Teachers.CountAsync();
        var totalClasses = await _context.Classes.CountAsync();

        var activeClasses = await _context.Classes.CountAsync(c => c.Status == "Đang học" || c.Status == "Sắp khai giảng");
        var activeStudents = await _context.Students.CountAsync(s => s.Status == "Đang học");

        var totalRevenue = await _context.Payments.SumAsync(p => p.AmountPaid);

        // Pending tuition: sum of tuition fees for active students minus sum of payments
        var studentsWithClasses = await _context.Students
            .Include(s => s.Class)
                .ThenInclude(c => c!.Course)
            .Include(s => s.Payments)
            .Where(s => s.ClassId != null && s.Status == "Đang học")
            .ToListAsync();

        decimal pendingTuition = 0;
        foreach (var s in studentsWithClasses)
        {
            var fee = s.Class?.Course?.TuitionFee ?? 0;
            var paid = s.Payments.Sum(p => p.AmountPaid);
            if (fee > paid)
            {
                pendingTuition += (fee - paid);
            }
        }

        var totalRegistrations = await _context.Registrations.CountAsync();
        var pendingRegistrations = await _context.Registrations.CountAsync(r => r.Status == "Mới");

        // Monthly Revenue Breakdown (Last 6 Months)
        var monthlyRevenueList = new List<MonthlyRevenueDto>();
        var now = DateTime.Today;
        for (int i = 5; i >= 0; i--)
        {
            var monthDate = now.AddMonths(-i);
            var year = monthDate.Year;
            var month = monthDate.Month;

            var rev = await _context.Payments
                .Where(p => p.PaymentDate.Year == year && p.PaymentDate.Month == month)
                .SumAsync(p => p.AmountPaid);

            var stCount = await _context.Students
                .CountAsync(s => s.RegistrationDate.Year == year && s.RegistrationDate.Month == month);

            monthlyRevenueList.Add(new MonthlyRevenueDto
            {
                Month = $"T{month:D2}/{year}",
                Revenue = rev,
                StudentCount = stCount
            });
        }

        // Students per Course
        var courses = await _context.Courses
            .Include(c => c.Classes)
                .ThenInclude(cl => cl.Students)
            .ToListAsync();

        var studentsPerCourse = courses.Select(c => new CourseStudentCountDto
        {
            CourseName = c.Title.Length > 25 ? c.Title.Substring(0, 22) + "..." : c.Title,
            StudentCount = c.Classes.SelectMany(cl => cl.Students).Count()
        }).ToList();

        // Payment status distribution
        int fullyPaid = 0, partiallyPaid = 0, unpaid = 0;
        var allStudents = await _context.Students
            .Include(s => s.Class)
                .ThenInclude(c => c!.Course)
            .Include(s => s.Payments)
            .ToListAsync();

        foreach (var s in allStudents)
        {
            var fee = s.Class?.Course?.TuitionFee ?? 0;
            var paid = s.Payments.Sum(p => p.AmountPaid);
            if (fee > 0)
            {
                if (paid >= fee) fullyPaid++;
                else if (paid > 0) partiallyPaid++;
                else unpaid++;
            }
        }

        var paymentDist = new List<StatusCountDto>
        {
            new StatusCountDto { Status = "Đã thanh toán đủ", Count = fullyPaid },
            new StatusCountDto { Status = "Đã đóng một phần", Count = partiallyPaid },
            new StatusCountDto { Status = "Chưa đóng", Count = unpaid }
        };

        // Student status distribution
        var studentStatusDist = await _context.Students
            .GroupBy(s => s.Status)
            .Select(g => new StatusCountDto { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        return Ok(new DashboardSummaryDto
        {
            TotalCourses = totalCourses,
            TotalStudents = totalStudents,
            TotalTeachers = totalTeachers,
            TotalClasses = totalClasses,
            ActiveClasses = activeClasses,
            ActiveStudents = activeStudents,
            TotalRevenue = totalRevenue,
            PendingTuition = pendingTuition,
            TotalRegistrations = totalRegistrations,
            PendingRegistrations = pendingRegistrations,
            MonthlyRevenue = monthlyRevenueList,
            StudentsPerCourse = studentsPerCourse,
            PaymentStatusDistribution = paymentDist,
            StudentStatusDistribution = studentStatusDist
        });
    }
}
