# Tech Context

## Technologies
- **Core Framework:** Medusa v2 (@medusajs/medusa v2.20.1)
- **Runtime:** Node.js (v20+), TypeScript
- **Database:** PostgreSQL (v15+) tren cong 5433 (`medusa-learn` db)
- **Cache / PubSub:** Redis (v7+) tren cong 6380
- **Storefront:** Next.js (React), Tailwind CSS
- **Package Manager:** pnpm (v9)
- **AI Tooling & Skills:** 
  - Medusa MCP Server (`https://docs.medusajs.com/mcp`)
  - Database MCP Server (`medusa_db` query truc tiep PostgreSQL port 5433)
  - Notion MCP (`@notionhq/notion-mcp-server`)
  - LarkSuite MCP (`larksuite` cho bao cao hang ngay `/daily-report` Base)
  - Plugin `medusa-dev` (7 Medusa agentic skills)

## Development Setup
- Moi truong: Linux/WSL (Ubuntu).
- Lenh chay chinh: `pnpm run dev` (khoi chay ca backend va storefront) hoac `pnpm run backend:dev`.
- Lenh DB: `cd my-medusa-store/apps/backend` && `pnpm exec medusa db:migrate`.
- Tai lieu hoc tap: `LEARNING_PLAN.md`, `notes/ai-tools-guide.md`, `notes/question.md`, va `notes/customer-module-extension-plan.md`.

## Constraints & Gotchas
- **pnpm v9 strictness:** Loi `[ERR_PNPM_IGNORED_BUILDS]` trong Medusa v2 can duoc giai quyet bang `pnpm approve-builds` truoc khi install.
- **Publishable Key:** Storefront va cac endpoint duoi `/store/*` bat buoc phai co `x-publishable-api-key` header (hoac `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`) hop le, neu khong se nhan loi `400 / 401 not_allowed`. Cac custom root endpoint (nhu `/hello-world`) khong nam duoi `/store/*` se khong bi chan boi middleware nay.
- **Guard System:** Moi tac vu AI thay doi file he thong phai tuan thu luat cam ghi tai `.agents/protected-paths.txt`.
- **Partial Unique Index Gotcha:** Index tren `customer_address` (`IDX_customer_address_unique_customer_shipping`) KHONG co dieu kien `deleted_at IS NULL`. Do do khi soft-delete dia chi mac dinh, bat buoc phai go co `is_default_shipping = false` truoc, neu khong khach hang se bi chan vinh vien khong the them dia chi mac dinh moi.
- **Saga Compensation vs Irreversible Actions:** Tuyet doi khong dat cac hanh dong vien thong ngoai he thong (gui Email, Zalo ZNS, SMS) vao Workflow Hooks vi Compensation Step khong the thu hoi tin nhan da gui. Cac hanh dong nay bat buoc phai giao cho Event Subscriber (`customer.created`).
- **Admin vs Store API Validation Boundary:** `POST /admin/customers` ho tro `WithAdditionalData` va `additionalDataValidator`, trong khi `POST /store/customers` su dung `StoreCreateCustomer` khong ho tro `additional_data`. Storefront truyen custom data qua truong `metadata` hoac qua custom Store route + workflow.
- **DTO Immutability Gotcha:** `has_account` chi co trong `CreateCustomerDTO`. `UpdateCustomerDTO` va `CustomerUpdatableFields` khong cho phep cap nhat truong nay.
- **JWT Refresh Gotcha:** Sau khi thuc hien mapping Customer vao `AuthIdentity`, client phai goi endpoint `POST /auth/token/refresh` de nhan token JWT moi chua `actor_id` (`customer_id`).
- **Persistent Idempotency Gotcha:** Step idempotency hoac transaction ID trong Workflow Engine chi co hieu luc trong mot workflow execution. De ngan chan cap phat trung lap tu cac request doc lap, bat buoc phai thiet lap DB unique constraint (vi du `UNIQUE(customer_id, reward_type, source_id)`).
