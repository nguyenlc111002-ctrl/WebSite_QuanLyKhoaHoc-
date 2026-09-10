using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Data;
using WebSite_QuanLyKhoaHoc.DTOs;
using WebSite_QuanLyKhoaHoc.Models;

namespace WebSite_QuanLyKhoaHoc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegistrationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RegistrationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Public: Submit registration from public website
    [HttpPost]
    public async Task<ActionResult<RegistrationDto>> CreateRegistration([FromBody] CreateRegistrationDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var courseExists = await _context.Courses.AnyAsync(c => c.Id == dto.CourseId);
        if (!courseExists) return BadRequest(new { message = "Khóa học đăng ký không tồn tại." });

        var reg = new Registration
        {
            FullName = dto.FullName.Trim(),
            Phone = dto.Phone.Trim(),
            Email = dto.Email.Trim(),
            CourseId = dto.CourseId,
            Notes = dto.Notes.Trim(),
            Status = "Mới",
            CreatedAt = DateTime.UtcNow
        };

        _context.Registrations.Add(reg);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đăng ký tư vấn khóa học thành công! Bộ phận tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất." });
    }

    // Admin: GET /api/registrations
    [Authorize(Roles = "SUPER_ADMIN,ADMIN,STAFF")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RegistrationDto>>> GetRegistrations(
        [FromQuery] string? search,
        [FromQuery] int? courseId,
        [FromQuery] string? status)
    {
        var query = _context.Registrations
            .Include(r => r.Course)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(r => r.FullName.ToLower().Contains(searchLower) ||
                                     r.Phone.Contains(searchLower) ||
                                     r.Email.ToLower().Contains(searchLower));
        }

        if (courseId.HasValue)
        {
            query = query.Where(r => r.CourseId == courseId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(r => r.Status.ToLower() == status.Trim().ToLower());
        }

        var regs = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();

        var dtos = regs.Select(r => new RegistrationDto
        {
            Id = r.Id,
            FullName = r.FullName,
            Phone = r.Phone,
            Email = r.Email,
            CourseId = r.CourseId,
            CourseTitle = r.Course?.Title ?? "",
            CourseFee = r.Course?.TuitionFee ?? 0,
            Notes = r.Notes,
            Status = r.Status,
            CreatedAt = r.CreatedAt
        }).ToList();

        return Ok(dtos);
    }

    // Admin: PUT /api/registrations/{id}/status
    [Authorize(Roles = "SUPER_ADMIN,ADMIN,STAFF")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateRegistrationStatus(int id, [FromBody] UpdateRegistrationStatusDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var reg = await _context.Registrations.FindAsync(id);
        if (reg == null) return NotFound(new { message = "Không tìm thấy thông tin đăng ký" });

        reg.Status = dto.Status.Trim();
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật trạng thái đăng ký thành công!" });
    }

    // Admin: DELETE /api/registrations/{id}
    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRegistration(int id)
    {
        var reg = await _context.Registrations.FindAsync(id);
        if (reg == null) return NotFound(new { message = "Không tìm thấy thông tin đăng ký" });

        _context.Registrations.Remove(reg);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa thông tin đăng ký thành công!" });
    }
}
