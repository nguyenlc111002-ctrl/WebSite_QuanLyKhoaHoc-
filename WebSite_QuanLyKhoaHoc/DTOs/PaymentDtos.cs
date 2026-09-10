using System.ComponentModel.DataAnnotations;

namespace WebSite_QuanLyKhoaHoc.DTOs;

public class PaymentDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public decimal TotalCourseFee { get; set; }
    public decimal AmountPaid { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class CreatePaymentDto
{
    [Required(ErrorMessage = "Vui lòng chọn học viên")]
    public int StudentId { get; set; }

    [Required(ErrorMessage = "Vui lòng chọn khóa học")]
    public int CourseId { get; set; }

    [Range(1000, 100000000, ErrorMessage = "Số tiền thanh toán phải lớn hơn 0")]
    public decimal AmountPaid { get; set; }

    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public string PaymentMethod { get; set; } = "Chuyển khoản";
    public string Notes { get; set; } = string.Empty;
}
