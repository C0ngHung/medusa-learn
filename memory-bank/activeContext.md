# Active Context

## Current Focus
Hoàn tất việc chuẩn hóa tài liệu (Architecture Playbook và Onboarding Guide) lên Notion. Chuẩn bị bước vào Task 1: Code Middleware Zod để validate request.

## Recent Changes
- Phân tích trực tiếp source code core của Medusa: `find-or-create-customer.ts` (cơ chế Guest mặc định) và `create-customer-account.ts` (ép cờ `has_account` và nối Auth Identity).
- Đã xuất bản thành công tài liệu **Medusa v2: Core Architecture & Design Patterns** lên Notion (bao gồm kiến trúc Workflow, Extension Triad, và nguyên lý không dùng async/await trong khai báo Workflow).
- Đã xuất bản thành công tài liệu **Onboarding Guide: Từ Java Master đến MedusaJS** lên Notion (4 cú quay xe tư duy: Event Loop, Destructuring, Duck Typing, First-class Functions).

## Active Decisions
- Lưu trữ mọi lý thuyết và Mental Model dưới dạng Notion page độc lập, có link liên kết, không viết dồn vào một file để tránh loãng thông tin.
- Chuẩn bị bắt tay vào Code Middleware cho Zalo ID (Task 1).

## Next Steps
1. Thực hành code thực chiến (Hands-on): Xây dựng tính năng Extend Customer Module giả lập gửi Zalo ID (Task 1: Tạo file `middlewares.ts` sử dụng Zod).
2. Các bước triển khai chi tiết đã được lưu trữ an toàn tại `notes/customer-module-extension-plan.md`. Khi bắt đầu Session mới, hãy đọc file này để tiếp tục.
3. Chạy `npm run dev` ở backend để verify Middleware, Hook và Subscriber.

## Known Issues / Blockers
- Không có. Sẵn sàng thực thi code.
