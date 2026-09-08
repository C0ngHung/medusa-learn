# Progress

## What Works
- [x] Môi trường Docker (PostgreSQL, Redis).
- [x] Medusa Backend (Port 9000) & Admin Dashboard.
- [x] Next.js Storefront (Port 8000).
- [x] Kết nối DB & Migrations.
- [x] Hệ thống AI Assistants (Portable Agent Kit) với Guard, Rules, Workflow bảo vệ dự án.
- [x] API Endpoint kiểm thử File-based routing (`apps/backend/src/api/hello-world/route.ts`).
- [x] Cấu hình MCP Server (`medusa-docs`, `notion`, `postgres-db`) và kiểm thử query trực tiếp vào DB thành công.
- [x] Thiết lập an toàn cho Database (Tạo `agents` role riêng cho MCP và lưu script `.sql`).
- [x] Tài liệu hướng dẫn phối hợp MCP & Plugin theo từng Phase (`notes/ai-tools-guide.md`).

## What's Left to Build
- [ ] Soi cấu trúc Database của Customer Module.
- [ ] Thực hành gọi Store/Admin API cho Customer (CRUD).
- [ ] Phân tích AuthIdentity và luồng Register/Login (E2E).
- [ ] Chốt phương án Architecture (Merge Strategy, Social Profile Storage).
- [ ] Tích hợp Google Login.
- [ ] Xây dựng Custom Auth Provider Mock (Zalo/TikTok).

## Known Issues
- (Chưa ghi nhận lỗi nghiêm trọng nào cản trở tiến độ. Mọi lỗi cài đặt ban đầu đã được giải quyết).
