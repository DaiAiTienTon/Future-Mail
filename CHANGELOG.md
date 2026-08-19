# Changelog — Future Mail ✉️⏳

Tất cả các thay đổi quan trọng của dự án **Future Mail** sẽ được ghi nhận tại tệp này.

Dự án tuân thủ theo chuẩn [Semantic Versioning](https://semver.org/lang/vi/) và [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.0] - 2026-08-19

### ✨ Cải Tiến (Changed)
- **Nâng Cấp HTML Email Template:**
  - Email gửi đi được nâng cấp từ plain text lên **HTML email đẹp** với thiết kế hiện đại.
  - Thêm **header** có branding "Future Mail" với nền gradient tối.
  - Thêm **phần phụ lục (Time Capsule Details)** hiển thị số ngày email "du hành thời gian", ngày lên lịch gửi và ngày giao thực tế.
  - Thêm **footer** với link về dự án.
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
