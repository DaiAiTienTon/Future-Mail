# Future Mail — Thư Gửi Tương Lai ✉️⏳

**Future Mail** là ứng dụng web full-stack cho phép người dùng viết thư gửi cho chính mình (hoặc người khác) trong tương lai và tự động gửi thư vào đúng thời điểm đã lên lịch (ngày, giờ, múi giờ).

---

## 🌟 Tính Năng Chính (Key Features)

- **Bảng Điều Khiển (Dashboard):** Thống kê số lượng thư đã lên lịch, thư đã gửi, hiển thị danh sách thư sắp tới (Upcoming) và thư gần đây (Recent) kèm trạng thái real-time.
- **Viết Thư Tương Lai (Create Future Email):**
  - Nhập địa chỉ nhận, tiêu đề, nội dung, chọn ngày, giờ và múi giờ IANA (ví dụ: `Asia/Ho_Chi_Minh`).
  - Xem trước thời gian giao thư theo thời gian thực (Live Preview).
  - Validation chặt chẽ cả ở Frontend và Backend (yêu cầu thời gian phải ở tương lai, định dạng email chuẩn, v.v.).
- **Chi Tiết Thư & Hủy Lịch (Email Detail & Cancellation):**
  - Xem thông tin chi tiết thư đã lên lịch.
  - Cho phép hủy thư khi thư ở trạng thái `SCHEDULED`.
- **Tự Động Gửi Thư (Persistent Scheduling):**
  - Sử dụng `node-cron` quét cơ sở dữ liệu định kỳ mỗi 30 giây.
  - Quản lý trạng thái an toàn: `SCHEDULED` ➔ `SENDING` ➔ `SENT` / `FAILED` nhằm chống gửi trùng lặp (Duplicate-send prevention).
  - Đảm bảo hoạt động ổn định kể cả khi backend bị khởi động lại.
- **Dịch Vụ Gửi Email Linh Hoạt:**
  - Hỗ trợ gửi qua **Resend API** hoặc **Gmail SMTP (Nodemailer)**.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM

### Backend
- **Runtime & Server:** Node.js + Express + TypeScript
- **Database & ORM:** SQLite + Prisma ORM
- **Task Scheduler:** `node-cron`
- **Validation:** Zod
- **Email Service:** Resend API & Nodemailer (SMTP)

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```text
Future-Mail/
├── backend/                # Backend API & Worker Cron
│   ├── prisma/             # Schema Prisma & migrations (SQLite)
│   ├── src/
│   │   ├── services/       # Dịch vụ gửi email (Resend & SMTP)
│   │   ├── index.ts        # Express REST API server
│   │   ├── prisma.ts       # Prisma Client instance
│   │   └── scheduler.ts    # Cron worker chạy định kỳ mỗi 30s
│   ├── .env.example        # Mẫu tham số cấu hình môi trường backend
│   └── package.json
│
├── frontend/               # Frontend React Single Page App
│   ├── src/
│   │   ├── components/     # UI Components (Layout, Navbar, MailCard, etc.)
│   │   ├── pages/          # Các trang (Dashboard, CreateEmail, EmailDetail)
│   │   ├── lib/            # API client & helpers
│   │   └── App.tsx
│   ├── vite.config.ts      # Cấu hình Vite & Proxy API (/api -> localhost:3000)
│   └── package.json
│
└── FUTURE-MAIL-SPEC.md     # Tài liệu tả chi tiết yêu cầu kỹ thuật dự án
```

---

## ⚙️ Cấu Hình Tham Số Môi Trường (Environment Configuration)

Tạo file `.env` trong thư mục `backend/` từ file mẫu `.env.example`:

```bash
cp backend/.env.example backend/.env
```

### Các Tham Số Cấu Hình Trong `backend/.env`:

| Tham Số (Variable) | Mô Tả (Description) | Giá Trị Mặc Định / Mẫu |
| :--- | :--- | :--- |
| `PORT` | Cổng chạy của backend server | `3000` |
| `DATABASE_URL` | Đường dẫn kết nối CSDL SQLite | `"file:./dev.db"` |
| `SMTP_HOST` | Địa chỉ Server SMTP (ví dụ Gmail) | `"smtp.gmail.com"` |
| `SMTP_PORT` | Cổng Server SMTP (465 cho SSL, 587 cho TLS) | `465` |
| `SMTP_USER` | Email tài khoản gửi SMTP | `"your-email@gmail.com"` |
| `SMTP_PASS` | Mật khẩu ứng dụng (App Password) | `"xxxx xxxx xxxx xxxx"` |
| `EMAIL_FROM_NAME` | Tên hiển thị người gửi | `"Future Mail"` |
| `RESEND_API_KEY` | API Key của dịch vụ Resend | `"re_123456789"` |
| `EMAIL_FROM` | Địa chỉ email gửi đi trong Resend | `"onboarding@resend.dev"` |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án (Execution Guide)

### 1. Cài Đặt Dependencies

**Cài đặt cho Backend:**
```bash
cd backend
npm install
```

**Cài đặt cho Frontend:**
```bash
cd frontend
npm install
```

### 2. Khởi Tạo Cơ Sở Dữ Liệu (Database Migration)

Chạy migration Prisma để tạo database SQLite (`dev.db`):
```bash
cd backend
npx prisma migrate dev --name init
```

### 3. Chạy Dự Án Trong Môi Trường Development

**Bước 1: Chạy Backend Server & Scheduler (Port 3000)**
```bash
cd backend
npm run dev
```

**Bước 2: Chạy Frontend App (Port 5173)**
```bash
cd frontend
npm run dev
```

Truy cập ứng dụng tại trình duyệt: `http://localhost:5173`

---

## 📡 Danh Sách API (REST API Endpoints)

| Method | Endpoint | Mô Tả |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra trạng thái hoạt động của backend |
| `GET` | `/api/emails` | Lấy danh sách tất cả các thư đã lên lịch |
| `GET` | `/api/emails/:id` | Lấy thông tin chi tiết của một thư theo ID |
| `POST` | `/api/emails` | Tạo và lên lịch gửi thư tương lai mới |
| `POST` | `/api/emails/:id/cancel` | Hủy lịch gửi thư (Chỉ áp dụng khi thư ở trạng thái `SCHEDULED`) |

---

## 🔒 Quy Trình Xử Lý Trạng Thái Thư (Email Lifecycle)

```text
  [SCHEDULED] ──(Cron 30s tìm thư hết hạn)──> [SENDING]
                                                  │
                                   ┌──────────────┴──────────────┐
                                   ▼                             ▼
                              (Thành công)                  (Thất bại)
                                   │                             │
                                   ▼                             ▼
                                [SENT]                        [FAILED]

  [SCHEDULED] ──(Người dùng bấm Hủy)──> [CANCELLED]
```