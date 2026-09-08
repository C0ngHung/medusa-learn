# Active Context

## Current Work Focus
Đã hoàn thành Phase 1 (Cài đặt & Hiểu kiến trúc). Đang chuẩn bị tiến hành Phase 2: **Customer + Auth Module Deep Dive (Sub-phase 2A)**.

## Recent Changes
- Hoàn tất cài đặt Database, Redis qua `docker-compose`.
- Khởi tạo Admin User và kết nối Publishable Key cho Storefront.
- Tích hợp thành công `Portable Agent Kit` (Guard, Rules, Slash Commands) từ dự án Microservice sang dự án Node.js/Medusa này.
- Xóa bỏ các file rác và dọn dẹp cấu trúc Workspace.
- Tổng kết Phase 1 bằng file ghi chú `notes/phase1-architecture.md`.
- Thử nghiệm thành công custom endpoint `hello-world` (`apps/backend/src/api/hello-world/route.ts`), kiểm chứng hành vi xác thực publishable key của Medusa Store API.
- Cấu hình MCP Server (`medusa-docs` official docs, `notion`) trong `.agents/mcp_config.json`.
- Thiết lập thành công user PostgreSQL (`agents` với quyền `SUPERUSER`, kết nối cổng `5433`) dành riêng cho MCP truy cập `medusa_db`.
- Đã kiểm tra query thành công từ MCP (`call_mcp_tool query`) vào bảng `customer` của Medusa.
- Lưu trữ script phân quyền database vào `scripts/setup-mcp-db-user.sql` và hướng dẫn trong `README.md`.
- Tích hợp Plugin `medusa-dev` (7 skills chuyên biệt cho Medusa v2: building-with-medusa, db-generate, db-migrate, building-storefronts, v.v.).
- Biên soạn hướng dẫn sử dụng AI Tools theo từng Phase trong `notes/ai-tools-guide.md` và cập nhật liên kết trong `README.md`.

## Next Steps
- Bắt đầu **Phase 2 (Sub-phase 2A)**: Thực hành Customer Module Data & CRUD.
- Thực hành UI (Quản trị): Tạo thử 1 Khách hàng và 1 Nhóm Khách hàng (Customer Group) trên Admin Dashboard.
- Soi Database: Truy cập PostgreSQL để phân tích cách DML của Medusa mapping dữ liệu Customer xuống các bảng (`customer`, `customer_group`, `customer_group_customer`).

## Active Decisions
- Giữ nguyên hệ thống Guard bằng Java của Portable Agent Kit vì tính tương thích cross-platform.
- Kết hợp song song MCP Server (`medusa-docs`) để tra cứu API/Type và Plugin (`medusa-dev`) để kiểm soát kiến trúc/anti-patterns.
- Tuân thủ nghiêm ngặt lộ trình đã đặt ra trong `LEARNING_PLAN.md`.
