using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Data;
using WebSite_QuanLyKhoaHoc.DTOs;
using WebSite_QuanLyKhoaHoc.Models;

namespace WebSite_QuanLyKhoaHoc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeachersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TeachersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeacherDto>>> GetTeachers(
        [FromQuery] string? search,
        [FromQuery] string? language,
        [FromQuery] string? status)
    {
        var query = _context.Teachers
            .Include(t => t.Classes)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(t => t.FullName.ToLower().Contains(searchLower) ||
                                     t.Code.ToLower().Contains(searchLower) ||
                                     t.Specialization.ToLower().Contains(searchLower));
        }

        if (!string.IsNullOrWhiteSpace(language))
        {
            query = query.Where(t => t.TeachingLanguage.ToLower() == language.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(t => t.Status.ToLower() == status.Trim().ToLower());
        }

        var teachers = await query.OrderBy(t => t.FullName).ToListAsync();

        var dtos = teachers.Select(t => new TeacherDto
        {
            Id = t.Id,
            Code = t.Code,
            FullName = t.FullName,
            AvatarUrl = t.AvatarUrl,
            TeachingLanguage = t.TeachingLanguage,
            Specialization = t.Specialization,
            Phone = t.Phone,
            Email = t.Email,
            Experience = t.Experience,
            Description = t.Description,
            Status = t.Status,
            CreatedAt = t.CreatedAt,
            TotalActiveClasses = t.Classes.Count(c => c.Status == "Đang học" || c.Status == "Sắp khai giảng")
        }).ToList();

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeacherDto>> GetTeacher(int id)
    {
        var t = await _context.Teachers
            .Include(te => te.Classes)
            .FirstOrDefaultAsync(te => te.Id == id);

        if (t == null) return NotFound(new { message = "Không tìm thấy giảng viên" });

        return Ok(new TeacherDto
        {
            Id = t.Id,
            Code = t.Code,
            FullName = t.FullName,
            AvatarUrl = t.AvatarUrl,
            TeachingLanguage = t.TeachingLanguage,
            Specialization = t.Specialization,
            Phone = t.Phone,
            Email = t.Email,
            Experience = t.Experience,
            Description = t.Description,
            Status = t.Status,
            CreatedAt = t.CreatedAt,
            TotalActiveClasses = t.Classes.Count(c => c.Status == "Đang học" || c.Status == "Sắp khai giảng")
        });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpPost]
    public async Task<ActionResult<TeacherDto>> CreateTeacher([FromBody] CreateUpdateTeacherDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (await _context.Teachers.AnyAsync(t => t.Code.ToLower() == dto.Code.Trim().ToLower()))
        {
            return BadRequest(new { message = "Mã giảng viên này đã tồn tại!" });
        }

        var teacher = new Teacher
        {
            Code = dto.Code.Trim(),
            FullName = dto.FullName.Trim(),
            AvatarUrl = string.IsNullOrWhiteSpace(dto.AvatarUrl) ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" : dto.AvatarUrl.Trim(),
            TeachingLanguage = dto.TeachingLanguage.Trim(),
            Specialization = dto.Specialization.Trim(),
            Phone = dto.Phone.Trim(),
            Email = dto.Email.Trim(),
            Experience = dto.Experience.Trim(),
            Description = dto.Description.Trim(),
            Status = dto.Status.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Teachers.Add(teacher);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTeacher), new { id = teacher.Id }, new TeacherDto
        {
            Id = teacher.Id,
            Code = teacher.Code,
            FullName = teacher.FullName,
            AvatarUrl = teacher.AvatarUrl,
            TeachingLanguage = teacher.TeachingLanguage,
            Specialization = teacher.Specialization,
            Phone = teacher.Phone,
            Email = teacher.Email,
            Experience = teacher.Experience,
            Description = teacher.Description,
            Status = teacher.Status,
            CreatedAt = teacher.CreatedAt
        });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeacher(int id, [FromBody] CreateUpdateTeacherDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var teacher = await _context.Teachers.FindAsync(id);
        if (teacher == null) return NotFound(new { message = "Không tìm thấy giảng viên" });

        if (await _context.Teachers.AnyAsync(t => t.Id != id && t.Code.ToLower() == dto.Code.Trim().ToLower()))
        {
            return BadRequest(new { message = "Mã giảng viên này đã tồn tại!" });
        }

        teacher.Code = dto.Code.Trim();
        teacher.FullName = dto.FullName.Trim();
        teacher.AvatarUrl = string.IsNullOrWhiteSpace(dto.AvatarUrl) ? teacher.AvatarUrl : dto.AvatarUrl.Trim();
        teacher.TeachingLanguage = dto.TeachingLanguage.Trim();
        teacher.Specialization = dto.Specialization.Trim();
        teacher.Phone = dto.Phone.Trim();
        teacher.Email = dto.Email.Trim();
        teacher.Experience = dto.Experience.Trim();
        teacher.Description = dto.Description.Trim();
        teacher.Status = dto.Status.Trim();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thông tin giảng viên thành công!" });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeacher(int id)
    {
        var teacher = await _context.Teachers.FindAsync(id);
        if (teacher == null) return NotFound(new { message = "Không tìm thấy giảng viên" });

        _context.Teachers.Remove(teacher);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa giảng viên thành công!" });
    }
}
