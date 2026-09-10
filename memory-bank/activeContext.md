# Active Context

## Current Focus
Bổ sung câu hỏi kiến trúc chuyên sâu Q11 vào `notes/question.md` (ranh giới độc lập giữa Customer Module và Promotion Module). Chuẩn bị bước vào Task 1: Code Middleware Quota Limit để validate và bảo vệ hệ thống.

## Recent Changes
- Bổ sung **Q11** vào `notes/question.md`: Phân tích chuyên sâu ranh giới trách nhiệm (SRP) giữa Customer Module và Promotion Module, minh chứng bằng "The Deletion Test" và Sequence Diagram điều phối qua Workflow/Remote Query.
- Phân tích trực tiếp source code core của Medusa: `find-or-create-customer.ts` (cơ chế Guest mặc định) và `create-customer-account.ts` (ép cờ `has_account` và nối Auth Identity).
- Đã xuất bản thành công tài liệu **Medusa v2: Core Architecture & Design Patterns** lên Notion (bao gồm kiến trúc Workflow, Extension Triad, và nguyên lý không dùng async/await trong khai báo Workflow).
- Đã xuất bản thành công tài liệu **Onboarding Guide: Từ Java Master đến MedusaJS** lên Notion (4 cú quay xe tư duy: Event Loop, Destructuring, Duck Typing, First-class Functions).
- Đã hoàn tất báo cáo hàng ngày (`/daily-report`) cho ngày 10/09/2026 lên LarkSuite Base với 5 tasks kỹ thuật chuẩn hóa (3 Today's tasks bao gồm Research Customer Module Architecture và 2 Yesterday's tasks).
- Đã nâng cấp toàn diện tài liệu **Medusa Customer Module — Bản chất cốt lõi** lên phiên bản v2 Enterprise Edition: Bổ sung Data Dictionary chi tiết, sơ đồ Sequence Diagrams đăng ký 2 bước & Guest Checkout, bảng tra cứu 6 Workflow Hook Points chính thức, mô hình Saga Compensation (`StepResponse`), nguyên tắc ranh giới Reversible (Hook) vs Irreversible (Subscriber), và giải pháp 3 lớp chống Spam Address DoS (Quota Middleware).
- Đính chính kiến trúc liên module: Bảng pivot vật lý `customer_account_holder` là Stored Link giữa `Modules.CUSTOMER` và `Modules.PAYMENT` (Stripe Customer ID), trong khi Auth Module liên kết bằng logic qua `app_metadata.customer_id`.
- Phát hiện & làm rõ nguyên nhân cờ `is_default_shipping` / `is_default_billing` luôn bằng `false` trong database (do Admin Dashboard và Storefront mặc định thiếu control kích hoạt).
- Toàn bộ nội dung chuẩn hóa đã được đồng bộ 100% lên trang Notion: https://app.notion.com/p/Medusa-Customer-Module-3d54499febfc809f9493e02b69e1f691.
- Đã hoàn tất báo cáo hàng ngày (`/daily-report`) trên LarkSuite Base: Cập nhật thành công 2 task lớn (`Research Customer Module Architecture` và `Nghiên cứu & Lập kế hoạch Mở rộng Customer Module`) sang trạng thái **Completed** với mô tả kỹ thuật chuyên sâu.

## Active Decisions
- Lưu trữ mọi lý thuyết và Mental Model dưới dạng Notion page độc lập, có link liên kết, không viết dồn vào một file để tránh loãng thông tin.
- Chuẩn bị bắt tay vào triển khai thực tế bộ 3 thành phần mở rộng: Quota Middleware, Loyalty Wallet Hook (Saga), và Welcome Subscriber.

## Next Steps
1. Thực hành code thực chiến (Hands-on) tại `my-medusa-store/apps/backend`:
   - Task 1: Tạo Middleware Quota Limit (`src/api/middlewares.ts`) chặn spam tối đa 20 địa chỉ.
   - Task 2: Tạo Workflow Hook `customersCreated` (`src/workflows/hooks/customer-created.ts`) có Saga Compensation.
   - Task 3: Tạo Event Subscriber `customer.created` (`src/subscribers/customer-created.ts`) gửi thông báo chào mừng.
2. Kiểm thử và xác nhận bằng unit / integration test và verify qua HTTP client.

## Known Issues / Blockers
- Không có. Sẵn sàng thực thi code.
