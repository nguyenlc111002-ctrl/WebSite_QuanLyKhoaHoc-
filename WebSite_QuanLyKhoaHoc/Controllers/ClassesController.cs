using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Data;
using WebSite_QuanLyKhoaHoc.DTOs;
using WebSite_QuanLyKhoaHoc.Models;

namespace WebSite_QuanLyKhoaHoc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ClassesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClassDto>>> GetClasses(
        [FromQuery] string? search,
        [FromQuery] int? courseId,
        [FromQuery] int? teacherId,
        [FromQuery] string? status)
    {
        var query = _context.Classes
            .Include(c => c.Course)
            .Include(c => c.Teacher)
            .Include(c => c.Students)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(c => c.Name.ToLower().Contains(searchLower) ||
                                     c.Code.ToLower().Contains(searchLower) ||
                                     c.Room.ToLower().Contains(searchLower));
        }

        if (courseId.HasValue)
        {
            query = query.Where(c => c.CourseId == courseId.Value);
        }

        if (teacherId.HasValue)
        {
            query = query.Where(c => c.TeacherId == teacherId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(c => c.Status.ToLower() == status.Trim().ToLower());
        }

        var classes = await query.OrderByDescending(c => c.CreatedAt).ToListAsync();

        var dtos = classes.Select(c => new ClassDto
        {
            Id = c.Id,
            Code = c.Code,
            Name = c.Name,
            CourseId = c.CourseId,
            CourseTitle = c.Course?.Title ?? "",
            CourseLanguage = c.Course?.Language ?? "",
            TeacherId = c.TeacherId,
            TeacherName = c.Teacher?.FullName ?? "Chưa phân công",
            TeacherAvatar = c.Teacher?.AvatarUrl ?? "",
            Room = c.Room,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            StudyHours = c.StudyHours,
            WeeklySchedule = c.WeeklySchedule,
            Capacity = c.Capacity,
            CurrentStudentCount = c.Students.Count,
            Status = c.Status,
            CreatedAt = c.CreatedAt
        }).ToList();

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClassDto>> GetClass(int id)
    {
        var c = await _context.Classes
            .Include(cl => cl.Course)
            .Include(cl => cl.Teacher)
            .Include(cl => cl.Students)
            .FirstOrDefaultAsync(cl => cl.Id == id);

        if (c == null) return NotFound(new { message = "Không tìm thấy lớp học" });

        return Ok(new ClassDto
        {
            Id = c.Id,
            Code = c.Code,
            Name = c.Name,
            CourseId = c.CourseId,
            CourseTitle = c.Course?.Title ?? "",
            CourseLanguage = c.Course?.Language ?? "",
            TeacherId = c.TeacherId,
            TeacherName = c.Teacher?.FullName ?? "Chưa phân công",
            TeacherAvatar = c.Teacher?.AvatarUrl ?? "",
            Room = c.Room,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            StudyHours = c.StudyHours,
            WeeklySchedule = c.WeeklySchedule,
            Capacity = c.Capacity,
            CurrentStudentCount = c.Students.Count,
            Status = c.Status,
            CreatedAt = c.CreatedAt
        });
    }

    [HttpGet("{id}/students")]
    public async Task<ActionResult<IEnumerable<StudentDto>>> GetClassStudents(int id)
    {
        var c = await _context.Classes.FindAsync(id);
        if (c == null) return NotFound(new { message = "Không tìm thấy lớp học" });

        var students = await _context.Students
            .Include(s => s.Class)
                .ThenInclude(cl => cl!.Course)
            .Include(s => s.Payments)
            .Include(s => s.Results)
            .Where(s => s.ClassId == id)
            .ToListAsync();

        var dtos = students.Select(s => {
            var totalFee = s.Class?.Course?.TuitionFee ?? 0;
            var paidAmount = s.Payments.Sum(p => p.AmountPaid);
            var remainingFee = totalFee - paidAmount;
            if (remainingFee < 0) remainingFee = 0;

            string payStatus = paidAmount >= totalFee && totalFee > 0 ? "Đã thanh toán đủ" : (paidAmount > 0 ? "Đã đóng một phần" : "Chưa đóng");
            var result = s.Results.FirstOrDefault(r => r.ClassId == id);

            return new StudentDto
            {
                Id = s.Id,
                Code = s.Code,
                FullName = s.FullName,
                DateOfBirth = s.DateOfBirth,
                Gender = s.Gender,
                Phone = s.Phone,
                Email = s.Email,
                Address = s.Address,
                RegistrationDate = s.RegistrationDate,
                ClassId = s.ClassId,
                ClassName = s.Class?.Name ?? "",
                CourseId = s.Class?.CourseId,
                CourseTitle = s.Class?.Course?.Title ?? "",
                TotalFee = totalFee,
                PaidAmount = paidAmount,
                RemainingFee = remainingFee,
                PaymentStatus = payStatus,
                LearningResult = result?.Grade ?? "Chưa đánh giá",
                TotalScore = result?.TotalScore,
                Status = s.Status,
                CreatedAt = s.CreatedAt
            };
        }).ToList();

        return Ok(dtos);
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpPost]
    public async Task<ActionResult<ClassDto>> CreateClass([FromBody] CreateUpdateClassDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (await _context.Classes.AnyAsync(c => c.Code.ToLower() == dto.Code.Trim().ToLower()))
        {
            return BadRequest(new { message = "Mã lớp học này đã tồn tại!" });
        }

        var courseExists = await _context.Courses.AnyAsync(c => c.Id == dto.CourseId);
        if (!courseExists) return BadRequest(new { message = "Khóa học không hợp lệ!" });

        var newClass = new Class
        {
            Code = dto.Code.Trim(),
            Name = dto.Name.Trim(),
            CourseId = dto.CourseId,
            TeacherId = dto.TeacherId,
            Room = dto.Room.Trim(),
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            StudyHours = dto.StudyHours.Trim(),
            WeeklySchedule = dto.WeeklySchedule.Trim(),
            Capacity = dto.Capacity,
            Status = dto.Status.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Classes.Add(newClass);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetClass), new { id = newClass.Id }, new ClassDto
        {
            Id = newClass.Id,
            Code = newClass.Code,
            Name = newClass.Name,
            CourseId = newClass.CourseId,
            Capacity = newClass.Capacity,
            Status = newClass.Status
        });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClass(int id, [FromBody] CreateUpdateClassDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var cls = await _context.Classes.FindAsync(id);
        if (cls == null) return NotFound(new { message = "Không tìm thấy lớp học" });

        if (await _context.Classes.AnyAsync(c => c.Id != id && c.Code.ToLower() == dto.Code.Trim().ToLower()))
        {
            return BadRequest(new { message = "Mã lớp học này đã tồn tại ở bản ghi khác!" });
        }

        cls.Code = dto.Code.Trim();
        cls.Name = dto.Name.Trim();
        cls.CourseId = dto.CourseId;
        cls.TeacherId = dto.TeacherId;
        cls.Room = dto.Room.Trim();
        cls.StartDate = dto.StartDate;
        cls.EndDate = dto.EndDate;
        cls.StudyHours = dto.StudyHours.Trim();
        cls.WeeklySchedule = dto.WeeklySchedule.Trim();
        cls.Capacity = dto.Capacity;
        cls.Status = dto.Status.Trim();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật lớp học thành công!" });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClass(int id)
    {
        var cls = await _context.Classes
            .Include(c => c.Students)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cls == null) return NotFound(new { message = "Không tìm thấy lớp học" });

        if (cls.Students.Any())
        {
            return BadRequest(new { message = "Không thể xóa lớp học đang có học viên tham gia. Vui lòng chuyển học viên sang lớp khác trước." });
        }

        _context.Classes.Remove(cls);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa lớp học thành công!" });
    }
}
