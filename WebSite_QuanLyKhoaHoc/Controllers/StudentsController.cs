using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Data;
using WebSite_QuanLyKhoaHoc.DTOs;
using WebSite_QuanLyKhoaHoc.Models;

namespace WebSite_QuanLyKhoaHoc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StudentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<object>> GetStudents(
        [FromQuery] string? search,
        [FromQuery] int? classId,
        [FromQuery] int? courseId,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Students
            .Include(s => s.Class)
                .ThenInclude(c => c!.Course)
            .Include(s => s.Class)
                .ThenInclude(c => c!.Teacher)
            .Include(s => s.Payments)
            .Include(s => s.Results)
            .Include(s => s.Attendances)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(s => s.FullName.ToLower().Contains(searchLower) ||
                                     s.Code.ToLower().Contains(searchLower) ||
                                     s.Phone.Contains(searchLower) ||
                                     s.Email.ToLower().Contains(searchLower));
        }

        if (classId.HasValue)
        {
            query = query.Where(s => s.ClassId == classId.Value);
        }

        if (courseId.HasValue)
        {
            query = query.Where(s => s.Class != null && s.Class.CourseId == courseId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(s => s.Status.ToLower() == status.Trim().ToLower());
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

        var students = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = students.Select(s => {
            var totalFee = s.Class?.Course?.TuitionFee ?? 0;
            var paidAmount = s.Payments.Sum(p => p.AmountPaid);
            var remainingFee = totalFee - paidAmount;
            if (remainingFee < 0) remainingFee = 0;

            string payStatus = paidAmount >= totalFee && totalFee > 0 ? "Đã thanh toán đủ" : (paidAmount > 0 ? "Đã đóng một phần" : "Chưa đóng");
            var result = s.Results.FirstOrDefault(r => r.ClassId == s.ClassId);

            int totalAtt = s.Attendances.Count;
            int presentAtt = s.Attendances.Count(a => a.IsPresent);
            int attRate = totalAtt > 0 ? (int)Math.Round((double)presentAtt * 100 / totalAtt) : 100;

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
                ClassName = s.Class?.Name ?? "Chưa phân lớp",
                CourseId = s.Class?.CourseId,
                CourseTitle = s.Class?.Course?.Title ?? "",
                TeacherName = s.Class?.Teacher?.FullName ?? "",
                TotalFee = totalFee,
                PaidAmount = paidAmount,
                RemainingFee = remainingFee,
                PaymentStatus = payStatus,
                LearningResult = result?.Grade ?? "Chưa đánh giá",
                TotalScore = result?.TotalScore,
                AttendanceRate = attRate,
                Status = s.Status,
                CreatedAt = s.CreatedAt
            };
        }).ToList();

        return Ok(new
        {
            items = dtos,
            totalItems,
            totalPages,
            currentPage = page,
            pageSize
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto>> GetStudent(int id)
    {
        var s = await _context.Students
            .Include(st => st.Class)
                .ThenInclude(c => c!.Course)
            .Include(st => st.Class)
                .ThenInclude(c => c!.Teacher)
            .Include(st => st.Payments)
            .Include(st => st.Results)
            .Include(st => st.Attendances)
            .FirstOrDefaultAsync(st => st.Id == id);

        if (s == null) return NotFound(new { message = "Không tìm thấy học viên" });

        var totalFee = s.Class?.Course?.TuitionFee ?? 0;
        var paidAmount = s.Payments.Sum(p => p.AmountPaid);
        var remainingFee = totalFee - paidAmount;
        if (remainingFee < 0) remainingFee = 0;

        string payStatus = paidAmount >= totalFee && totalFee > 0 ? "Đã thanh toán đủ" : (paidAmount > 0 ? "Đã đóng một phần" : "Chưa đóng");
        var result = s.Results.FirstOrDefault(r => r.ClassId == s.ClassId);

        int totalAtt = s.Attendances.Count;
        int presentAtt = s.Attendances.Count(a => a.IsPresent);
        int attRate = totalAtt > 0 ? (int)Math.Round((double)presentAtt * 100 / totalAtt) : 100;

        return Ok(new StudentDto
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
            ClassName = s.Class?.Name ?? "Chưa phân lớp",
            CourseId = s.Class?.CourseId,
            CourseTitle = s.Class?.Course?.Title ?? "",
            TeacherName = s.Class?.Teacher?.FullName ?? "",
            TotalFee = totalFee,
            PaidAmount = paidAmount,
            RemainingFee = remainingFee,
            PaymentStatus = payStatus,
            LearningResult = result?.Grade ?? "Chưa đánh giá",
            TotalScore = result?.TotalScore,
            AttendanceRate = attRate,
            Status = s.Status,
            CreatedAt = s.CreatedAt
        });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN,STAFF")]
    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateUpdateStudentDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (await _context.Students.AnyAsync(s => s.Code.ToLower() == dto.Code.Trim().ToLower()))
        {
            return BadRequest(new { message = "Mã học viên này đã tồn tại!" });
        }

        // Validate max capacity of class if assigned
        if (dto.ClassId.HasValue)
        {
            var cls = await _context.Classes.Include(c => c.Students).FirstOrDefaultAsync(c => c.Id == dto.ClassId.Value);
            if (cls != null && cls.Students.Count >= cls.Capacity)
            {
                return BadRequest(new { message = $"Lớp {cls.Name} đã đủ số lượng học viên tối đa ({cls.Capacity} học viên)." });
            }
        }

        var student = new Student
        {
            Code = dto.Code.Trim(),
            FullName = dto.FullName.Trim(),
            DateOfBirth = dto.DateOfBirth,
            Gender = dto.Gender.Trim(),
            Phone = dto.Phone.Trim(),
            Email = dto.Email.Trim(),
            Address = dto.Address.Trim(),
            ClassId = dto.ClassId,
            RegistrationDate = DateTime.UtcNow,
            Status = dto.Status.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, new StudentDto
        {
            Id = student.Id,
            Code = student.Code,
            FullName = student.FullName,
            Email = student.Email,
            Phone = student.Phone,
            Status = student.Status
        });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN,STAFF")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] CreateUpdateStudentDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var student = await _context.Students.FindAsync(id);
        if (student == null) return NotFound(new { message = "Không tìm thấy học viên" });

        if (await _context.Students.AnyAsync(s => s.Id != id && s.Code.ToLower() == dto.Code.Trim().ToLower()))
        {
            return BadRequest(new { message = "Mã học viên này đã tồn tại ở bản ghi khác!" });
        }

        if (dto.ClassId.HasValue && dto.ClassId != student.ClassId)
        {
            var cls = await _context.Classes.Include(c => c.Students).FirstOrDefaultAsync(c => c.Id == dto.ClassId.Value);
            if (cls != null && cls.Students.Count >= cls.Capacity)
            {
                return BadRequest(new { message = $"Lớp {cls.Name} đã đạt sức chứa tối đa ({cls.Capacity} học viên)." });
            }
        }

        student.Code = dto.Code.Trim();
        student.FullName = dto.FullName.Trim();
        student.DateOfBirth = dto.DateOfBirth;
        student.Gender = dto.Gender.Trim();
        student.Phone = dto.Phone.Trim();
        student.Email = dto.Email.Trim();
        student.Address = dto.Address.Trim();
        student.ClassId = dto.ClassId;
        student.Status = dto.Status.Trim();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thông tin học viên thành công!" });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null) return NotFound(new { message = "Không tìm thấy học viên" });

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa thông tin học viên thành công!" });
    }
}
