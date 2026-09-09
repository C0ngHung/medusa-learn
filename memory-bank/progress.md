# Progress Status

## Milestone 1: Setup & Architecture 
- **Trạng thái:** ✅ Hoàn thành
- **Output:** DB, MCP, `setup-mcp-db-user.sql` (agents role), Kiến trúc cốt lõi (Notion).

## Milestone 2: Làm chủ Customer Module Mặc định
- **Trạng thái:** Đang thực hiện (In Progress)
- **Công việc đã hoàn thành:** 
  - Khảo sát tài liệu lý thuyết Customer Module, data models.
  - Phân tích kiến trúc tích hợp (Module Links, AuthIdentity, App Metadata).
  - DB inspection & source code analysis (5 bảng DB, UNIQUE index email+has_account, endpoints, `find-or-create-customer.ts`, `create-customer-account.ts`).
  - Hoàn thiện Plan v2 chi tiết và xuất bản thành công tài liệu **Customer Module (5 Phase)** lên Notion.
  - Xuất bản tài liệu **Medusa v2: Core Architecture & Design Patterns** lên Notion.
  - Xuất bản tài liệu **Onboarding Guide: Từ Java Master đến MedusaJS** lên Notion.
- **Việc cần làm tiếp:** Thực hành xây dựng Extension (Middleware, Workflow Hook, Subscriber) cho Customer Module.

## Milestone 3: Tương tác & Impact với các Module khác
- **Trạng thái:** ⬜ Chưa bắt đầu

## Milestone 4: Mở rộng (Extend) Customer Module
- **Trạng thái:** Đang chuẩn bị (Ready for Task 1)
- **Kế hoạch:** Sẽ thực hiện Code Zod Middleware, Workflow Hook, và Subscriber (Background Job) để lưu thông tin Zalo ID vào metadata.

## Milestone 5: Xử lý Data Integrity (Merge Logic)
- **Trạng thái:** ⬜ Chưa bắt đầu

## Milestone 6: Thực chiến Social Login Use Case
- **Trạng thái:** ⬜ Chưa bắt đầu
