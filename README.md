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
- **Trợ Lý AI Hỗ Trợ Viết Thư (AI Chat Assistant):**
  - Khung chat AI thông minh hỗ trợ tìm ý tưởng, gợi ý câu hỏi tự ngẫm và trau chuốt văn phong gửi bản thân/người thân trong tương lai.
  - Kết nối trực tiếp qua Cloudflare AI Worker API (`AI_WORKER_URL`).

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
- **AI Assistant:** Cloudflare Workers AI / REST API

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```text
Future-Mail/
├── backend/                # Backend API & Worker Cron
│   ├── prisma/             # Schema Prisma & migrations (SQLite)
│   ├── src/
│   │   ├── services/       # Dịch vụ gửi email (Resend & SMTP)
│   │   ├── index.ts        # Express REST API server & AI endpoint
│   │   ├── prisma.ts       # Prisma Client instance
│   │   └── scheduler.ts    # Cron worker chạy định kỳ mỗi 30s
│   ├── .env.example        # Mẫu tham số cấu hình môi trường backend
│   └── package.json
│
├── frontend/               # Frontend React Single Page App
│   ├── src/
│   │   ├── components/     # UI Components (Layout, AIChatWidget, MailCard, etc.)
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
| `AI_WORKER_URL` | Đường dẫn API Cloudflare AI Worker hỗ trợ viết thư | `"https://rough-boat-ebb6.tuvkdt2003.workers.dev/"` |

---

### 📧 Hướng Dẫn Chi Tiết Cấu Hình Gmail SMTP (Lấy Mật Khẩu Ứng Dụng / App Password)

Khi sử dụng Gmail làm server SMTP gửi thư, bạn **KHÔNG THỂ** sử dụng mật khẩu đăng nhập Gmail thông thường (Google sẽ chặn kết nối vì lý do bảo mật). Thay vào đó, bạn cần tạo **Mật Khẩu Ứng Dụng (App Password)** 16 ký tự theo các bước sau:

#### Bước 1: Bật Xác minh 2 bước (2-Step Verification)
1. Truy cập vào quản lý tài khoản Google tại: [myaccount.google.com](https://myaccount.google.com/)
2. Chọn mục **Bảo mật** (Security) ở menu bên trái.
3. Tại phần **Cách bạn đăng nhập vào Google**, chọn **Xác minh 2 bước** (2-Step Verification) và tiến hành bật nếu chưa bật.

#### Bước 2: Tạo Mật khẩu ứng dụng (App Password)
1. Truy cập trực tiếp trang tạo Mật khẩu ứng dụng: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Điền tên gợi nhớ cho ứng dụng vào ô **Tên ứng dụng** (ví dụ: `Future Mail`).
3. Bấm **Tạo** (Create).
4. Google sẽ hiển thị một cửa sổ có mã 16 ký tự màu vàng (ví dụ: `xxxx xxxx xxxx xxxx`). Bạn hãy sao chép chuỗi mã này.

#### Bước 3: Cấu hình vào file `backend/.env`
Điền các giá trị thu được vào file `backend/.env` của bạn:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="tài_khoản_gmail_của_bạn@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"
EMAIL_FROM_NAME="Future Mail"
```

> **Lưu ý:** 
> - `SMTP_PORT="465"` sử dụng mã hóa SSL (khuyên dùng). Bạn cũng có thể dùng `587` cho kết nối TLS.
> - Mã `SMTP_PASS` có thể giữ nguyên khoảng trắng hoặc bỏ khoảng trắng, hệ thống backend sẽ tự động chuẩn hóa khi kết nối.

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
| `POST` | `/api/ai/chat` | Trò chuyện với Trợ lý AI hỗ trợ gợi ý và chỉnh sửa nội dung thư |


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

---

## 🐛 Quản Lý Lỗi & Đóng Góp (Bug Tracker & Community)

- **Hệ thống theo dõi và quản lý lỗi (Bug Tracker):** [GitHub Issues — Future Mail](https://github.com/DaiAiTienTon/Future-Mail/issues)
- **Kho mã nguồn chính thức (Source Code Repository):** [GitHub — Future-Mail](https://github.com/DaiAiTienTon/Future-Mail)
- **Lịch sử thay đổi (Changelog):** Xem chi tiết tại [CHANGELOG.md](file:///d:/Future-Mail/CHANGELOG.md)

Mọi đóng góp, báo lỗi hoặc yêu cầu tính năng mới xin vui lòng tạo Issue trên hệ thống Bug Tracker của dự án.

---

## 📦 Bản Phát Hành (Releases)

- **Phiên bản hiện tại:** `v1.0.0`
- **Bản phát hành chính thức (Release Archive):** [Future-Mail v1.0.0 Release](https://github.com/DaiAiTienTon/Future-Mail/releases/tag/v1.0.0)

---

## 📄 Giấy Phép (License)

Sản phẩm mã nguồn mở **Future Mail** được cấp phép theo giấy phép mở **[MIT License](file:///d:/Future-Mail/LICENSE)** (Được công nhận bởi OSI - Open Source Initiative). 

Toàn văn giấy phép được đính kèm trong tệp `LICENSE` ở thư mục gốc của dự án.