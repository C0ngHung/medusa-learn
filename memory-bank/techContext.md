# Tech Context

## Technologies
- **Core Framework:** Medusa v2 (@medusajs/medusa)
- **Runtime:** Node.js (v20+), TypeScript
- **Database:** PostgreSQL (v15+)
- **Cache / PubSub:** Redis (v7+)
- **Storefront:** Next.js (React), Tailwind CSS
- **Package Manager:** pnpm (v9)
- **AI Tooling & Skills:** Medusa MCP Server (`https://docs.medusajs.com/mcp`), Notion MCP (`@notionhq/notion-mcp-server`), Plugin `medusa-dev` (7 Medusa agentic skills)

## Development Setup
- Môi trường: Linux/WSL (Ubuntu).
- Lệnh chạy chính: `pnpm run dev` (khởi chạy cả backend và storefront) hoặc `pnpm run backend:dev`.
- Lệnh DB: `cd my-medusa-store/apps/backend` && `pnpm exec medusa db:migrate`.
- Tài liệu học tập: `LEARNING_PLAN.md` và `notes/ai-tools-guide.md`.

## Constraints & Gotchas
- **pnpm v9 strictness:** Lỗi `[ERR_PNPM_IGNORED_BUILDS]` trong Medusa v2 cần được giải quyết bằng `pnpm approve-builds` trước khi install.
- **Publishable Key:** Storefront và các endpoint dưới `/store/*` bắt buộc phải có `x-publishable-api-key` header (hoặc `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`) hợp lệ, nếu không sẽ nhận lỗi `400 / 401 not_allowed`. Các custom root endpoint (như `/hello-world`) không nằm dưới `/store/*` sẽ không bị chặn bởi middleware này.
- **Guard System:** Mọi tác vụ AI thay đổi file hệ thống phải tuân thủ luật cấm ghi tại `.agents/protected-paths.txt`.
