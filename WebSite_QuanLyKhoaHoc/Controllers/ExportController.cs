using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebSite_QuanLyKhoaHoc.Data;

namespace WebSite_QuanLyKhoaHoc.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SUPER_ADMIN,ADMIN,STAFF")]
public class ExportController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ExportController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("students")]
    public async Task<IActionResult> ExportStudents()
    {
        var students = await _context.Students
            .Include(s => s.Class)
                .ThenInclude(c => c!.Course)
            .Include(s => s.Payments)
            .OrderBy(s => s.Code)
            .ToListAsync();

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Danh Sách Học Viên");

        // Headers
        worksheet.Cell(1, 1).Value = "Mã HV";
        worksheet.Cell(1, 2).Value = "Họ Và Tên";
        worksheet.Cell(1, 3).Value = "Ngày Sinh";
        worksheet.Cell(1, 4).Value = "Giới Tính";
        worksheet.Cell(1, 5).Value = "Số Điện Thoại";
        worksheet.Cell(1, 6).Value = "Email";
        worksheet.Cell(1, 7).Value = "Lớp Học";
        worksheet.Cell(1, 8).Value = "Khóa Học";
        worksheet.Cell(1, 9).Value = "Học Phí";
        worksheet.Cell(1, 10).Value = "Đã Đóng";
        worksheet.Cell(1, 11).Value = "Còn Thiếu";
        worksheet.Cell(1, 12).Value = "Trạng Thái";

        var headerRow = worksheet.Row(1);
        headerRow.Style.Font.Bold = true;
        headerRow.Style.Fill.BackgroundColor = XLColor.FromHtml("#1E40AF"); // Navy blue
        headerRow.Style.Font.FontColor = XLColor.White;

        int row = 2;
        foreach (var s in students)
        {
            var fee = s.Class?.Course?.TuitionFee ?? 0;
            var paid = s.Payments.Sum(p => p.AmountPaid);
            var rem = Math.Max(0, fee - paid);

            worksheet.Cell(row, 1).Value = s.Code;
            worksheet.Cell(row, 2).Value = s.FullName;
            worksheet.Cell(row, 3).Value = s.DateOfBirth.ToString("dd/MM/yyyy");
            worksheet.Cell(row, 4).Value = s.Gender;
            worksheet.Cell(row, 5).Value = s.Phone;
            worksheet.Cell(row, 6).Value = s.Email;
            worksheet.Cell(row, 7).Value = s.Class?.Name ?? "Chưa phân lớp";
            worksheet.Cell(row, 8).Value = s.Class?.Course?.Title ?? "";
            worksheet.Cell(row, 9).Value = fee;
            worksheet.Cell(row, 10).Value = paid;
            worksheet.Cell(row, 11).Value = rem;
            worksheet.Cell(row, 12).Value = s.Status;
            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        var content = stream.ToArray();

        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"DanhSachHocVien_VietHan_{DateTime.Now:yyyyMMdd}.xlsx");
    }

    [HttpGet("payments")]
    public async Task<IActionResult> ExportPayments()
    {
        var payments = await _context.Payments
            .Include(p => p.Student)
            .Include(p => p.Course)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Báo Cáo Học Phí");

        worksheet.Cell(1, 1).Value = "Mã HV";
        worksheet.Cell(1, 2).Value = "Họ Tên Học Viên";
        worksheet.Cell(1, 3).Value = "Khóa Học";
        worksheet.Cell(1, 4).Value = "Số Tiền Đóng (VNĐ)";
        worksheet.Cell(1, 5).Value = "Ngày Đóng";
        worksheet.Cell(1, 6).Value = "Phương Thức";
        worksheet.Cell(1, 7).Value = "Ghi Chú";

        var headerRow = worksheet.Row(1);
        headerRow.Style.Font.Bold = true;
        headerRow.Style.Fill.BackgroundColor = XLColor.FromHtml("#0D9488");
        headerRow.Style.Font.FontColor = XLColor.White;

        int row = 2;
        foreach (var p in payments)
        {
            worksheet.Cell(row, 1).Value = p.Student?.Code ?? "";
            worksheet.Cell(row, 2).Value = p.Student?.FullName ?? "";
            worksheet.Cell(row, 3).Value = p.Course?.Title ?? "";
            worksheet.Cell(row, 4).Value = p.AmountPaid;
            worksheet.Cell(row, 5).Value = p.PaymentDate.ToString("dd/MM/yyyy HH:mm");
            worksheet.Cell(row, 6).Value = p.PaymentMethod;
            worksheet.Cell(row, 7).Value = p.Notes;
            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        var content = stream.ToArray();

        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"BaoCaoHocPhi_VietHan_{DateTime.Now:yyyyMMdd}.xlsx");
    }
}
