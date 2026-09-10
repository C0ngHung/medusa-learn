# Tech Context

## Technologies
- **Core Framework:** Medusa v2 (@medusajs/medusa v2.20.1)
- **Runtime:** Node.js (v20+), TypeScript
- **Database:** PostgreSQL (v15+) trên cổng 5433 (`medusa-learn` db)
- **Cache / PubSub:** Redis (v7+) trên cổng 6380
- **Storefront:** Next.js (React), Tailwind CSS
- **Package Manager:** pnpm (v9)
- **AI Tooling & Skills:** 
  - Medusa MCP Server (`https://docs.medusajs.com/mcp`)
  - Database MCP Server (`medusa_db` query trực tiếp PostgreSQL port 5433)
  - Notion MCP (`@notionhq/notion-mcp-server`)
  - LarkSuite MCP (`larksuite` cho báo cáo hàng ngày `/daily-report` Base)
  - Plugin `medusa-dev` (7 Medusa agentic skills)

## Development Setup
- Môi trường: Linux/WSL (Ubuntu).
- Lệnh chạy chính: `pnpm run dev` (khởi chạy cả backend và storefront) hoặc `pnpm run backend:dev`.
- Lệnh DB: `cd my-medusa-store/apps/backend` && `pnpm exec medusa db:migrate`.
- Tài liệu học tập: `LEARNING_PLAN.md`, `notes/ai-tools-guide.md`, `notes/question.md`, và `notes/customer-module-extension-plan.md`.

## Constraints & Gotchas
- **pnpm v9 strictness:** Lỗi `[ERR_PNPM_IGNORED_BUILDS]` trong Medusa v2 cần được giải quyết bằng `pnpm approve-builds` trước khi install.
- **Publishable Key:** Storefront và các endpoint dưới `/store/*` bắt buộc phải có `x-publishable-api-key` header (hoặc `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`) hợp lệ, nếu không sẽ nhận lỗi `400 / 401 not_allowed`. Các custom root endpoint (như `/hello-world`) không nằm dưới `/store/*` sẽ không bị chặn bởi middleware này.
- **Guard System:** Mọi tác vụ AI thay đổi file hệ thống phải tuân thủ luật cấm ghi tại `.agents/protected-paths.txt`.
- **Partial Unique Index Gotcha:** Index trên `customer_address` (`IDX_customer_address_unique_customer_shipping`) KHÔNG có điều kiện `deleted_at IS NULL`. Do đó khi soft-delete địa chỉ mặc định, bắt buộc phải gỡ cờ `is_default_shipping = false` trước, nếu không khách hàng sẽ bị chặn vĩnh viễn không thể thêm địa chỉ mặc định mới.
- **Saga Compensation vs Irreversible Actions:** Tuyệt đối không đặt các hành động viễn thông ngoài hệ thống (gửi Email, Zalo ZNS, SMS) vào Workflow Hooks vì Compensation Step không thể thu hồi tin nhắn đã gửi. Các hành động này bắt buộc phải giao cho Event Subscriber (`customer.created`).
