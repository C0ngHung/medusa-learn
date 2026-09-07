# Active Context

## Current Work Focus
Đã hoàn thành Phase 1 (Cài đặt & Hiểu kiến trúc). Đang chuẩn bị tiến hành Phase 2: **Customer + Auth Module Deep Dive (Sub-phase 2A)**.

## Recent Changes
- Hoàn tất cài đặt Database, Redis qua `docker-compose`.
- Khởi tạo Admin User và kết nối Publishable Key cho Storefront.
- Tích hợp thành công `Portable Agent Kit` (Guard, Rules, Slash Commands) từ dự án Microservice sang dự án Node.js/Medusa này.
- Xóa bỏ các file rác và dọn dẹp cấu trúc Workspace.
- Tổng kết Phase 1 bằng file ghi chú `notes/phase1-architecture.md`.
- Khởi tạo local Git repository để track quá trình phát triển.

## Next Steps
- Thực hành UI (Quản trị): Tạo thử 1 Khách hàng và 1 Nhóm Khách hàng (Customer Group) trên Admin Dashboard.
- Soi Database: Truy cập PostgreSQL qua công cụ quản lý CSDL (DBeaver/pgAdmin) để phân tích cách DML của Medusa mapping dữ liệu Customer xuống các bảng (`customer`, `customer_group`, `customer_group_customer`).

## Active Decisions
- Giữ nguyên hệ thống Guard bằng Java của Portable Agent Kit vì tính tương thích cross-platform.
- Tuân thủ nghiêm ngặt lộ trình đã đặt ra trong `LEARNING_PLAN.md`.
