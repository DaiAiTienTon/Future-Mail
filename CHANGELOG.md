# Changelog — Future Mail ✉️⏳

Tất cả các thay đổi quan trọng của dự án **Future Mail** sẽ được ghi nhận tại tệp này.

Dự án tuân thủ theo chuẩn [Semantic Versioning](https://semver.org/lang/vi/) và [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.2] - 2026-08-20

### ✨ Cải Tiến (Changed)
- **Tự Động Cập Nhật Dữ Liệu Thời Gian Thực ở Frontend:**
  - Tự động cập nhật ngầm danh sách thư và thống kê trên **Dashboard** mỗi 5 giây mà không cần reload trang.
  - Tự động thăm dò và đồng bộ trạng thái gửi thư (`SCHEDULED` → `SENT`) trên trang **Email Detail** ngay khi backend hoàn tất xử lý.
  - Tối ưu không gây gián đoạn hay nhấp nháy giao diện khi cập nhật dữ liệu nền.

---

## [1.1.1] - 2026-08-19

### ✨ Cải Tiến (Changed)
- **Tối Ưu Giao Diện Email & Bản Địa Hóa Tiếng Việt:**
  - Chuyển đổi giao diện sang nền sáng (Clean Light Theme) dạng thẻ Card thanh lịch, chuẩn kích thước và căn chỉnh cân đối theo ảnh mẫu.
  - Chuyển đổi 100% nội dung tiêu đề, ngày tháng, thông điệp phụ lục và chân trang sang Tiếng Việt chuẩn.
  - Tối ưu căn lề, đường kẻ phân cách mảnh và biểu tượng thương hiệu Future Mail.

---

## [1.1.0] - 2026-08-19

### ✨ Cải Tiến (Changed)
- **Nâng Cấp HTML Email Template:**
  - Email gửi đi được nâng cấp từ plain text lên **HTML email** hỗ trợ phụ lục thời gian gửi.
  - Thêm phần phụ lục hiển thị số ngày email du hành thời gian, ngày lên lịch gửi và ngày giao thực tế.
  - Giữ lại plain text fallback để tương thích với email client cũ.

---

## [1.0.0] - 2026-08-18


### 🌟 Thêm Mới (Added)
- **Hệ Thống Lên Lịch Gửi Thư Tương Lai (Persistent Scheduling):**
  - Tích hợp `node-cron` chạy ngầm kiểm tra và tự động gửi email định kỳ mỗi 30 giây.
  - Quản lý vòng đời thư với 4 trạng thái: `SCHEDULED`, `SENDING`, `SENT`, `FAILED` và hỗ trợ hủy thư (`CANCELLED`).
  - Cơ sở dữ liệu SQLite + Prisma ORM quản lý lưu trữ dữ liệu an toàn.
- **Trợ Lý AI Hỗ Trợ Viết Thư (AI Chat Assistant):**
  - Tích hợp khung chat Trợ lý AI kết nối với Cloudflare AI Worker API (`AI_WORKER_URL`).
  - Gợi ý câu hỏi tự ngẫm, ý tưởng và trau chuốt văn phong gửi bản thân hoặc người thân trong tương lai.
- **Giao Diện Người Dùng (UI Frontend):**
  - Trang Dashboard thống kê số lượng thư, danh sách thư Sắp tới (Upcoming) và Gần đây (Recent).
  - Trang Viết Thư (Create Future Email) với bộ xem trước thời gian thực (Live Preview) và validation thời gian IANA Timezone.
  - Trang Chi tiết Thư (Email Detail) hiển thị trạng thái và tính năng hủy thư khi chưa gửi.
- **Dịch Vụ Gửi Email Linh Hoạt:**
  - Hỗ trợ gửi thư qua **Resend API** hoặc **Gmail SMTP (Nodemailer)**.
- **Tài Liệu & Giấy Phép:**
  - Phát hành mã nguồn mở theo giấy phép **MIT License**.
  - Đính kèm tệp `LICENSE`, `CHANGELOG.md` và hướng dẫn cài đặt chi tiết trong `README.md`.
