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
- **AI-Assisted Development Stack:** Kết hợp MCP Server (`medusa-docs` cung cấp real-time schema/API context) cùng Plugin `medusa-dev` (7 skills cung cấp code generator, architectural rules và anti-pattern prevention) theo workflow 6 bước (Think -> Ask -> Code -> Validate -> DB -> Test).

## Component Relationships & Module Links
- `Storefront (Next.js)` --> `Backend API (Cổng 9000)` (Xác thực qua Publishable Key).
- `Auth Module` <--> `Module Link (customer_account_holder)` <--> `Customer Module`.
- `Cart / Order` bám vào `Customer` qua `customer_id`.
- `Promotion` bám vào `Customer` qua `customer_group_id`.

## Customer Module Data Patterns
- **5 Tables Architecture:**
  - `customer`: Bảng trung tâm lưu trữ danh bạ, họ tên, email, phone, metadata (JSONB).
  - `customer_address`: 1 Customer có nhiều Address, phân biệt bằng cờ `is_default_shipping` / `is_default_billing`.
  - `customer_group`: Nhóm khách hàng (VIP, Wholesaler,...).
  - `customer_group_customer`: Bảng trung gian N-N liên kết Customer và Group.
  - `customer_account_holder`: Bảng Module Link trung gian liên kết Customer và AuthIdentity.
- **Compound Unique Index:** `IDX_customer_email_has_account_unique` trên `(email, has_account) WHERE (deleted_at IS NULL)`. Cho phép 1 Guest và 1 Registered tồn tại song song cùng email, nhưng không cho phép 2 Guest hoặc 2 Registered trùng email.
- **Soft Delete Pattern:** Tất cả các bảng Customer sử dụng `deleted_at`, khi xóa bằng API/Service thì record chỉ được đánh dấu timestamp, không bị purge khỏi DB.
