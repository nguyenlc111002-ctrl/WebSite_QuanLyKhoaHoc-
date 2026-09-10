using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Data;
using WebSite_QuanLyKhoaHoc.DTOs;
using WebSite_QuanLyKhoaHoc.Models;

namespace WebSite_QuanLyKhoaHoc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SchedulesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SchedulesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Public / Admin: GET /api/schedules
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ScheduleDto>>> GetSchedules(
        [FromQuery] int? classId,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var query = _context.Schedules
            .Include(s => s.Class)
                .ThenInclude(c => c!.Teacher)
            .AsQueryable();

        if (classId.HasValue)
        {
            query = query.Where(s => s.ClassId == classId.Value);
        }

        if (startDate.HasValue)
        {
            query = query.Where(s => s.Date >= startDate.Value.Date);
        }

        if (endDate.HasValue)
        {
            query = query.Where(s => s.Date <= endDate.Value.Date);
        }

        var schedules = await query.OrderBy(s => s.Date).ThenBy(s => s.StartTime).ToListAsync();

        var dtos = schedules.Select(s => new ScheduleDto
        {
            Id = s.Id,
            ClassId = s.ClassId,
            ClassName = s.Class?.Name ?? "",
            ClassCode = s.Class?.Code ?? "",
            TeacherName = s.Class?.Teacher?.FullName ?? "",
            Date = s.Date,
            StartTime = s.StartTime,
            EndTime = s.EndTime,
            Room = string.IsNullOrWhiteSpace(s.Room) ? (s.Class?.Room ?? "") : s.Room,
            Note = s.Note
        }).ToList();

        return Ok(dtos);
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpPost]
    public async Task<ActionResult<ScheduleDto>> CreateSchedule([FromBody] CreateUpdateScheduleDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var cls = await _context.Classes.FindAsync(dto.ClassId);
        if (cls == null) return BadRequest(new { message = "Lớp học không tồn tại" });

        var schedule = new Schedule
        {
            ClassId = dto.ClassId,
            Date = dto.Date.Date,
            StartTime = dto.StartTime.Trim(),
            EndTime = dto.EndTime.Trim(),
            Room = string.IsNullOrWhiteSpace(dto.Room) ? cls.Room : dto.Room.Trim(),
            Note = dto.Note.Trim()
        };

        _context.Schedules.Add(schedule);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSchedules), new { id = schedule.Id }, new ScheduleDto
        {
            Id = schedule.Id,
            ClassId = schedule.ClassId,
            ClassName = cls.Name,
            Date = schedule.Date,
            StartTime = schedule.StartTime,
            EndTime = schedule.EndTime,
            Room = schedule.Room,
            Note = schedule.Note
        });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSchedule(int id, [FromBody] CreateUpdateScheduleDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var schedule = await _context.Schedules.FindAsync(id);
        if (schedule == null) return NotFound(new { message = "Không tìm thấy lịch học" });

        var cls = await _context.Classes.FindAsync(dto.ClassId);
        if (cls == null) return BadRequest(new { message = "Lớp học không tồn tại" });

        schedule.ClassId = dto.ClassId;
        schedule.Date = dto.Date.Date;
        schedule.StartTime = dto.StartTime.Trim();
        schedule.EndTime = dto.EndTime.Trim();
        schedule.Room = string.IsNullOrWhiteSpace(dto.Room) ? cls.Room : dto.Room.Trim();
        schedule.Note = dto.Note.Trim();

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật lịch học thành công!" });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSchedule(int id)
    {
        var schedule = await _context.Schedules.FindAsync(id);
        if (schedule == null) return NotFound(new { message = "Không tìm thấy lịch học" });

        _context.Schedules.Remove(schedule);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa lịch học thành công!" });
    }
}
