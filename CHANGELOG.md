# Changelog — Future Mail ✉️⏳

Tất cả các thay đổi quan trọng của dự án **Future Mail** sẽ được ghi nhận tại tệp này.

Dự án tuân thủ theo chuẩn [Semantic Versioning](https://semver.org/lang/vi/) và [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
