# Medusa v2: Customer & Auth Module Deep Dive

Dự án này là môi trường thực hành, học tập và nghiên cứu chuyên sâu về **Customer Module** và **Auth Module** của [Medusa v2](https://medusajs.com/). 

Mục tiêu cốt lõi của dự án là giúp đội ngũ phát triển (Caelus & SmartOSC Team) nắm vững kiến trúc mới của Medusa (Turborepo, DML, Module Links, Workflows) để sẵn sàng triển khai thực tế tính năng **Social Login** phức tạp (Google, Facebook, Zalo, TikTok...) và hợp nhất tài khoản khách hàng (Account Merge) cho các dự án thương mại điện tử cấp doanh nghiệp.

## 🎯 Mục tiêu dự án (Project Scope)

- Xây dựng thành công hệ thống Medusa v2 bao gồm Backend API, Admin Dashboard và Next.js Storefront.
- Cấu hình hạ tầng độc lập thông qua Docker (PostgreSQL 15, Redis 7).
- Khảo sát sâu Data Models (DML), API Endpoints, và Module Links của Customer và Auth Module.
- Giả lập, thử nghiệm và tích hợp các Custom Auth Providers (OAuth2).

## 🛠️ Tech Stack

- **Core Framework:** Medusa v2 (`@medusajs/medusa`)
- **Storefront:** Next.js (React), Tailwind CSS
- **Runtime:** Node.js (v20+), TypeScript
- **Database:** PostgreSQL (v15+)
- **Cache / PubSub:** Redis (v7+)
- **Package Manager:** pnpm (v9)

## 🚀 Hướng dẫn cài đặt (Installation)

### 1. Yêu cầu hệ thống (Prerequisites)
- [Node.js](https://nodejs.org/en) (v20 trở lên)
- [pnpm](https://pnpm.io/installation)
- [Docker & Docker Compose](https://www.docker.com/)

### 2. Khởi chạy Database & Redis
Dự án sử dụng file `docker-compose.yml` có sẵn ở thư mục gốc để dựng môi trường Database độc lập:
```bash
docker-compose up -d
```
*Lưu ý: Postgres sẽ chạy ở port `5433` và Redis chạy ở port `6380` để tránh xung đột với các service có sẵn trên máy.*

### 3. Cài đặt Dependencies
Vì Medusa v2 sử dụng pnpm workspace và có quy định chặt chẽ về build script, chạy lệnh sau tại thư mục `my-medusa-store/`:
```bash
cd my-medusa-store
pnpm approve-builds
pnpm install
```

### 4. Setup Database Schema & Admin User
Khởi tạo bảng trong Database bằng Medusa CLI và tạo tài khoản Admin:
```bash
cd my-medusa-store/apps/backend
npx medusa db:migrate
npx medusa user -e admin@test.com -p supersecret
```

### 5. Khởi chạy ứng dụng
Quay lại thư mục `my-medusa-store/` và chạy lệnh Dev:
```bash
cd my-medusa-store
pnpm run dev
```
- **Backend API:** `http://localhost:9000`
- **Admin Dashboard:** `http://localhost:9000/app` (Đăng nhập bằng tài khoản tạo ở bước 4)
- **Storefront:** `http://localhost:8000` *(Lưu ý: Storefront cần có `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` lấy từ Admin Dashboard dán vào file `apps/storefront/.env.local`)*

## 📁 Cấu trúc dự án

```text
.
├── .agents/                 # [AG-Kit] Luật, Workflows và Guard System cho AI Assistant
├── memory-bank/             # [AG-Kit] Lưu trữ ngữ cảnh (Context) dự án
├── notes/                   # Ghi chú kỹ thuật đúc kết sau mỗi Phase học
├── my-medusa-store/         # Workspace chính của Medusa v2
│   ├── apps/
│   │   ├── backend/         # Medusa Core API & Admin
│   │   └── storefront/      # Next.js Storefront
├── docker-compose.yml       # Cấu hình Postgres & Redis
├── LEARNING_PLAN.md         # Giáo trình học chi tiết (6 Phases)
└── README.md                # File tài liệu này
```

## 🤖 Portable Agent Kit (AI Tooling)

Dự án được bảo vệ và tối ưu hóa bởi **Portable Agent Kit** (dành cho Antigravity IDE / Claude Code):
- **Guard System (`.agents/guard/`):** Chặn AI thực thi các lệnh nguy hiểm (vd: xoá thư mục build, sửa file lock).
- **Rules (`.agents/rules/`):** Ép AI tuân thủ các quy chuẩn khắt khe về code (Sử dụng DML thay vì TypeORM, không viết raw SQL, File-based routing).
- **Workflows:** Hỗ trợ các lệnh AI slash commands như `/diagnose`, `/refactor`, `/bugfix` để tăng tốc độ debug và phân tích kiến trúc Medusa.

## 📈 Trạng thái học tập hiện tại

Dự án đang tuân theo lộ trình 6 Phases được vạch ra trong `LEARNING_PLAN.md`:
- [x] **Phase 1:** Setup môi trường & Phân tích Kiến trúc tổng quan (Medusa Modules, Module Links).
- [ ] **Phase 2:** Khảo sát Database (Customer CRUD).
- [ ] **Phase 3:** Kiến trúc Tích hợp (Social Login Strategy).
- [ ] **Phase 4:** Tích hợp Google Login thực tế.
- [ ] **Phase 5:** Tích hợp Custom Provider (Mock API Zalo/TikTok).
- [ ] **Phase 6:** Xử lý Edge Cases & Merge Accounts.
