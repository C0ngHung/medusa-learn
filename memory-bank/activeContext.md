# Active Context

## Current Focus
Thực chiến với Customer Module: Trải nghiệm API Store/Admin, kiểm chứng hành vi cờ `has_account` giữa Guest và Registered User.

## Recent Changes
- Đã xuất bản thành công tài liệu **Medusa Customer Module (5 Phase)** lên Notion tại: `https://app.notion.com/p/Medusa-Customer-Module-3d54499febfc809f9493e02b69e1f691`.
- Đã chuyển đổi kiến trúc sang Single Source of Truth: Xóa bỏ script local và sử dụng 100% MCP (`API-update-page-markdown`) để đọc/ghi trực tiếp lên Notion.
- Bổ sung thành công sơ đồ Mermaid Mindmap/Flowchart và phần Workflow Hooks lên Notion.

## Active Decisions
- Toàn bộ tài liệu chuẩn hóa 6 Phase: Bản chất -> `has_account` & Uniqueness -> Impact -> API có sẵn -> Hướng mở rộng (Extend) -> Workflow & Hooks đã được đồng bộ trực tiếp lên Notion bằng MCP.

## Next Steps
1. Thực hành code thực chiến (Hands-on): Xây dựng tính năng Extend Customer Module giả lập gửi Zalo ID.
2. Các bước triển khai chi tiết đã được lưu trữ an toàn tại `notes/customer-module-extension-plan.md`. Khi bắt đầu Session mới, hãy đọc file này để tiếp tục.
3. Chạy `npm run dev` ở backend để verify Middleware, Hook và Subscriber.

## Known Issues / Blockers
- Không còn blocker nào. Notion sync đã hoàn tất 100%.
