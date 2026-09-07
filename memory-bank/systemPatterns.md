# System Patterns

## Architecture
- **Medusa v2 Workspace:** Sử dụng Turborepo để quản lý mono-repo (Backend + Storefront).
- **File-based Routing:** Các API Routes được định nghĩa dựa trên cấu trúc thư mục (`src/api/...`).
- **Data Modeling Language (DML):** Sử dụng DML thay cho TypeORM để định nghĩa Schema.
- **Workflows:** Sử dụng hệ thống Workflow (Saga pattern) của Medusa cho các luồng logic phức tạp, đảm bảo tính nhất quán dữ liệu (Rollback khi có lỗi).

## Technical Decisions
- **Dockerized Infrastructure:** Sử dụng `docker-compose` tự build để quản lý riêng rẽ PostgreSQL (port 5433) và Redis (port 6380), thay vì dùng dịch vụ Cloud mặc định.
- **Package Manager:** Dùng `pnpm` workspace chuẩn.
- **Custom AI Tooling:** Tích hợp `Portable Agent Kit` để bảo vệ mã nguồn (Guard System), cung cấp Workflows và quy định (Rules) code chuyên biệt cho Medusa/Node.js.

## Component Relationships
- `Storefront (Next.js)` --> `Backend API (Cổng 9000)` (Xác thực qua Publishable Key).
- `Auth Module` <--> `Module Link` <--> `Customer Module`.
