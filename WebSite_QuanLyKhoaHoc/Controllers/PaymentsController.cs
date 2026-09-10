using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Data;
using WebSite_QuanLyKhoaHoc.DTOs;
using WebSite_QuanLyKhoaHoc.Models;

namespace WebSite_QuanLyKhoaHoc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PaymentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN,STAFF")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments(
        [FromQuery] string? search,
        [FromQuery] int? studentId,
        [FromQuery] int? courseId)
    {
        var query = _context.Payments
            .Include(p => p.Student)
            .Include(p => p.Course)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(p => p.Student != null && (
                p.Student.FullName.ToLower().Contains(searchLower) ||
                p.Student.Code.ToLower().Contains(searchLower)
            ));
        }

        if (studentId.HasValue)
        {
            query = query.Where(p => p.StudentId == studentId.Value);
        }

        if (courseId.HasValue)
        {
            query = query.Where(p => p.CourseId == courseId.Value);
        }

        var payments = await query.OrderByDescending(p => p.PaymentDate).ToListAsync();

        var dtos = payments.Select(p => new PaymentDto
        {
            Id = p.Id,
            StudentId = p.StudentId,
            StudentCode = p.Student?.Code ?? "",
            StudentName = p.Student?.FullName ?? "",
            CourseId = p.CourseId,
            CourseTitle = p.Course?.Title ?? "",
            TotalCourseFee = p.Course?.TuitionFee ?? 0,
            AmountPaid = p.AmountPaid,
            PaymentDate = p.PaymentDate,
            PaymentMethod = p.PaymentMethod,
            Notes = p.Notes
        }).ToList();

        return Ok(dtos);
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpPost]
    public async Task<ActionResult<PaymentDto>> CreatePayment([FromBody] CreatePaymentDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var student = await _context.Students.FindAsync(dto.StudentId);
        if (student == null) return BadRequest(new { message = "Học viên không tồn tại" });

        var course = await _context.Courses.FindAsync(dto.CourseId);
        if (course == null) return BadRequest(new { message = "Khóa học không tồn tại" });

        var payment = new Payment
        {
            StudentId = dto.StudentId,
            CourseId = dto.CourseId,
            AmountPaid = dto.AmountPaid,
            PaymentDate = dto.PaymentDate,
            PaymentMethod = dto.PaymentMethod.Trim(),
            Notes = dto.Notes.Trim()
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Ghi nhận thanh toán thành công!" });
    }

    [Authorize(Roles = "SUPER_ADMIN,ADMIN")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePayment(int id)
    {
        var payment = await _context.Payments.FindAsync(id);
        if (payment == null) return NotFound(new { message = "Không tìm thấy thông tin giao dịch" });

        _context.Payments.Remove(payment);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa giao dịch thành công!" });
    }
}
