using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Data;
using WebSite_QuanLyKhoaHoc.DTOs;
using WebSite_QuanLyKhoaHoc.Models;

namespace WebSite_QuanLyKhoaHoc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CoursesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Public / Admin: GET /api/courses
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CourseDto>>> GetCourses(
        [FromQuery] string? search,
        [FromQuery] string? language,
        [FromQuery] string? level,
        [FromQuery] string? status,
        [FromQuery] string? sort)
    {
        var query = _context.Courses
            .Include(c => c.Classes)
                .ThenInclude(cl => cl.Students)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(c => c.Title.ToLower().Contains(searchLower) ||
                                     c.Code.ToLower().Contains(searchLower) ||
                                     c.Description.ToLower().Contains(searchLower));
        }

        if (!string.IsNullOrWhiteSpace(language))
        {
            query = query.Where(c => c.Language.ToLower() == language.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(level))
        {
            query = query.Where(c => c.Level.ToLower() == level.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(c => c.Status.ToLower() == status.Trim().ToLower());
        }

        if (sort == "fee_asc")
        {
            query = query.OrderBy(c => c.TuitionFee);
        }
        else if (sort == "fee_desc")
        {
            query = query.OrderByDescending(c => c.TuitionFee);
        }
        else
        {
            query = query.OrderByDescending(c => c.CreatedAt);
        }

        var courses = await query.ToListAsync();

        var dtos = courses.Select(c => new CourseDto
        {
            Id = c.Id,
            Code = c.Code,
            Title = c.Title,
            Language = c.Language,
            Level = c.Level,
            Description = c.Description,
            TuitionFee = c.TuitionFee,
            Duration = c.Duration,
            ImageUrl = c.ImageUrl,
            Status = c.Status,
            CreatedAt = c.CreatedAt,
            TotalClassesCount = c.Classes.Count,
            TotalStudentsCount = c.Classes.SelectMany(cl => cl.Students).Count()
        }).ToList();

        return Ok(dtos);
    }

    // Public / Admin: GET /api/courses/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<CourseDto>> GetCourse(int id)
    {
        var c = await _context.Courses
            .Include(co => co.Classes)
                .ThenInclude(cl => cl.Teacher)
            .Include(co => co.Classes)
                .ThenInclude(cl => cl.Students)
            .FirstOrDefaultAsync(co => co.Id == id);

        if (c == null) return NotFound(new { message = "Không tìm thấy khóa học" });

        var dto = new CourseDto
        {
            Id = c.Id,
            Code = c.Code,
            Title = c.Title,
            Language = c.Language,
            Level = c.Level,
            Description = c.Description,
            TuitionFee = c.TuitionFee,
            Duration = c.Duration,
            ImageUrl = c.ImageUrl,
            Status = c.Status,
            CreatedAt = c.CreatedAt,
            TotalClassesCount = c.Classes.Count,
            TotalStudentsCount = c.Classes.SelectMany(cl => cl.Students).Count()
        };

        return Ok(dto);
    }

    // Admin: POST /api/courses
    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpPost]
    public async Task<ActionResult<CourseDto>> CreateCourse([FromBody] CreateUpdateCourseDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (await _context.Courses.AnyAsync(c => c.Code.ToLower() == dto.Code.Trim().ToLower()))
        {
            return BadRequest(new { message = "Mã khóa học này đã tồn tại!" });
        }

        var course = new Course
        {
            Code = dto.Code.Trim(),
            Title = dto.Title.Trim(),
            Language = dto.Language.Trim(),
            Level = dto.Level.Trim(),
            Description = dto.Description.Trim(),
            TuitionFee = dto.TuitionFee,
            Duration = dto.Duration.Trim(),
            ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl) ? "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80" : dto.ImageUrl.Trim(),
            Status = dto.Status.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, new CourseDto
        {
            Id = course.Id,
            Code = course.Code,
            Title = course.Title,
            Language = course.Language,
            Level = course.Level,
            Description = course.Description,
            TuitionFee = course.TuitionFee,
            Duration = course.Duration,
            ImageUrl = course.ImageUrl,
            Status = course.Status,
            CreatedAt = course.CreatedAt
        });
    }

    // Admin: PUT /api/courses/{id}
    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, [FromBody] CreateUpdateCourseDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var course = await _context.Courses.FindAsync(id);
        if (course == null) return NotFound(new { message = "Không tìm thấy khóa học" });

        if (await _context.Courses.AnyAsync(c => c.Id != id && c.Code.ToLower() == dto.Code.Trim().ToLower()))
        {
            return BadRequest(new { message = "Mã khóa học này đã tồn tại ở một bản ghi khác!" });
        }

        course.Code = dto.Code.Trim();
        course.Title = dto.Title.Trim();
        course.Language = dto.Language.Trim();
        course.Level = dto.Level.Trim();
        course.Description = dto.Description.Trim();
        course.TuitionFee = dto.TuitionFee;
        course.Duration = dto.Duration.Trim();
        course.ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl) ? course.ImageUrl : dto.ImageUrl.Trim();
        course.Status = dto.Status.Trim();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật khóa học thành công!" });
    }

    // Admin: DELETE /api/courses/{id}
    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var course = await _context.Courses
            .Include(c => c.Classes)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null) return NotFound(new { message = "Không tìm thấy khóa học" });

        if (course.Classes.Any())
        {
            return BadRequest(new { message = "Không thể xóa khóa học đã có lớp học đang thuộc khóa này." });
        }

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa khóa học thành công!" });
    }
}
