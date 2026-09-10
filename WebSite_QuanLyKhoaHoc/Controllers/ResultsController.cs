using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Data;
using WebSite_QuanLyKhoaHoc.DTOs;
using WebSite_QuanLyKhoaHoc.Models;

namespace WebSite_QuanLyKhoaHoc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResultsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ResultsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN,STAFF")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResultDto>>> GetResults(
        [FromQuery] string? search,
        [FromQuery] int? classId,
        [FromQuery] int? studentId)
    {
        var query = _context.Results
            .Include(r => r.Student)
            .Include(r => r.Class)
                .ThenInclude(c => c!.Course)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(r => r.Student != null && (
                r.Student.FullName.ToLower().Contains(searchLower) ||
                r.Student.Code.ToLower().Contains(searchLower)
            ));
        }

        if (classId.HasValue)
        {
            query = query.Where(r => r.ClassId == classId.Value);
        }

        if (studentId.HasValue)
        {
            query = query.Where(r => r.StudentId == studentId.Value);
        }

        var results = await query.OrderByDescending(r => r.UpdatedAt).ToListAsync();

        var dtos = results.Select(r => new ResultDto
        {
            Id = r.Id,
            StudentId = r.StudentId,
            StudentCode = r.Student?.Code ?? "",
            StudentName = r.Student?.FullName ?? "",
            ClassId = r.ClassId,
            ClassName = r.Class?.Name ?? "",
            CourseTitle = r.Class?.Course?.Title ?? "",
            QuizScore = r.QuizScore,
            MidtermScore = r.MidtermScore,
            FinalScore = r.FinalScore,
            TotalScore = r.TotalScore,
            Grade = r.Grade,
            Comments = r.Comments,
            UpdatedAt = r.UpdatedAt
        }).ToList();

        return Ok(dtos);
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpPost]
    public async Task<IActionResult> SaveResult([FromBody] CreateUpdateResultDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var student = await _context.Students.FindAsync(dto.StudentId);
        if (student == null) return BadRequest(new { message = "Học viên không tồn tại" });

        var cls = await _context.Classes.FindAsync(dto.ClassId);
        if (cls == null) return BadRequest(new { message = "Lớp học không tồn tại" });

        // Calculate total score: 20% Quiz + 30% Midterm + 50% Final
        decimal totalScore = Math.Round((dto.QuizScore * 0.2m) + (dto.MidtermScore * 0.3m) + (dto.FinalScore * 0.5m), 1);

        // Grade evaluation
        string grade = "Chưa đạt";
        if (totalScore >= 9.0m) grade = "Xuất sắc";
        else if (totalScore >= 8.0m) grade = "Tốt";
        else if (totalScore >= 6.5m) grade = "Khá";
        else if (totalScore >= 5.0m) grade = "Trung bình";

        var existing = await _context.Results.FirstOrDefaultAsync(r => r.StudentId == dto.StudentId && r.ClassId == dto.ClassId);
        if (existing != null)
        {
            existing.QuizScore = dto.QuizScore;
            existing.MidtermScore = dto.MidtermScore;
            existing.FinalScore = dto.FinalScore;
            existing.TotalScore = totalScore;
            existing.Grade = grade;
            existing.Comments = dto.Comments.Trim();
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var res = new Result
            {
                StudentId = dto.StudentId,
                ClassId = dto.ClassId,
                QuizScore = dto.QuizScore,
                MidtermScore = dto.MidtermScore,
                FinalScore = dto.FinalScore,
                TotalScore = totalScore,
                Grade = grade,
                Comments = dto.Comments.Trim(),
                UpdatedAt = DateTime.UtcNow
            };
            _context.Results.Add(res);
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Lưu kết quả học tập thành công!", totalScore, grade });
    }
}
