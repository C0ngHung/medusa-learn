# Hướng dẫn tận dụng MCP & Plugin cho LEARNING_PLAN.md

> Tài liệu này map cụ thể từng công cụ (MCP Server + Plugin Skills) vào từng Phase của Learning Plan, kèm câu lệnh mẫu bạn có thể copy/paste thẳng vào chat.

---

## Tổng quan: Bạn có gì trong tay?

### 🔌 MCP Server: `medusa-docs`
- **Khai báo tại:** [mcp_config.json](file:///home/ubuntu/Data_D/SmartOSC/project/backend/nodejs/medusa-learn/.agents/mcp_config.json) (dòng 13-15)
- **Endpoint:** `https://docs.medusajs.com/mcp`
- **Vai trò:** "Từ điển sống" — tra cứu tài liệu Medusa chính thức theo thời gian thực. Dùng khi cần biết chính xác method signature, config option, hoặc kiến thức mới nhất mà AI chưa biết.
- **Khi nào dùng:** Khi cần tra cứu API cụ thể, method signatures, config options, hoặc thông tin mới nhất từ docs.

### 📦 Plugin: `medusa-dev` (7 Skills)
- **Đặt tại:** [.agents/plugins/medusa-dev/skills/](file:///home/ubuntu/Data_D/SmartOSC/project/backend/nodejs/medusa-learn/.agents/plugins/medusa-dev/skills)
- **Vai trò:** "Cẩm nang kiến trúc" — chứa best practices, anti-patterns, code patterns chuẩn. Dùng khi AI cần **biết cách làm đúng**, không chỉ biết API.

| # | Skill | Vai trò | Khi nào dùng |
|---|-------|---------|-------------|
| 1 | `building-with-medusa` | Skill chính cho backend | Module, Workflow, API Route, Data Model, Module Link, Auth |
| 2 | `building-admin-dashboard-customizations` | Admin UI | Widget, custom page, form, table trong Admin Dashboard |
| 3 | `building-storefronts` | Frontend integration | Gọi API từ storefront, SDK usage, React Query |
| 4 | `creating-internal-agents` | AI Agent nội bộ | Tạo AI agent cho admin (nâng cao, Phase sau) |
| 5 | `db-generate` | Tạo migration | Sau khi tạo/sửa data model |
| 6 | `db-migrate` | Chạy migration | Áp dụng migration vào DB |
| 7 | `new-user` | Tạo admin user | Tạo tài khoản admin mới |

### Mỗi Skill chứa gì bên trong?

Skill `building-with-medusa` (skill chính) có **13 reference files** chi tiết:

| Reference File | Nội dung |
|---|---|
| `custom-modules.md` | Cách tạo module + data model |
| `workflows.md` | Cách viết workflow + steps |
| `api-routes.md` | Cấu trúc API route + validation |
| `module-links.md` | Liên kết giữa các module |
| `querying-data.md` | Query patterns (`query.graph()`, `query.index()`) |
| `authentication.md` | Auth middleware, protected routes, actor types |
| `error-handling.md` | MedusaError types |
| `scheduled-jobs.md` | Cron jobs |
| `subscribers-and-events.md` | Event subscribers |
| `workflow-hooks.md` | Hook vào workflow có sẵn |
| `data-models.md` | DML syntax |
| `frontend-integration.md` | SDK integration |
| `troubleshooting.md` | Lỗi thường gặp |

---

## Map từng Phase → Công cụ cụ thể

---

### Phase 2A: Customer Module Data & CRUD (2 ngày)

**Mục tiêu:** Hiểu schema Customer, Service, API endpoints, `has_account`, groups, addresses

#### Dùng MCP để tra cứu tài liệu

```
Câu lệnh mẫu bạn gõ vào chat:
```

> "Dùng MCP medusa-docs tra cứu giúp mình tài liệu về **Customer Module** — bao gồm data models, các field chính, và quan hệ giữa Customer, CustomerGroup, CustomerAddress."

> "Dùng MCP tra cứu danh sách **Store API endpoints** liên quan đến Customer — GET, POST, DELETE nào có sẵn?"

> "Dùng MCP tra cứu **Admin API endpoints** để quản lý Customer Groups — cách tạo group, gán customer vào group."

#### Dùng Plugin để hiểu patterns

> "Dựa vào skill `@building-with-medusa`, load reference `querying-data.md` và giải thích cho mình cách dùng `query.graph()` để lấy thông tin Customer kèm theo Addresses và Groups."

> "Dựa vào skill `@building-with-medusa`, load reference `custom-modules.md` và giải thích Data Model syntax (DML) của Medusa — so sánh với TypeORM."

#### Bài tập 2A-1 & 2A-2

> "Hướng dẫn mình gọi API tạo Customer Group VIP bằng cURL (Admin API). Tra cứu MCP để lấy đúng endpoint và request body."

> "Hướng dẫn mình gọi Store API để CRUD Customer Address. Tra cứu MCP cho đúng endpoint, lưu ý header `x-publishable-api-key`."

---

### Phase 2B: Auth Module Concepts (1-2 ngày)

**Mục tiêu:** AuthIdentity, Actor Type, Provider, JWT, Module Link Auth↔Customer

#### Dùng MCP để tra cứu

> "Dùng MCP tra cứu tài liệu **Auth Module** — giải thích AuthIdentity, actor_type, và cách Auth Module link với Customer Module."

> "Dùng MCP tra cứu về **Auth Providers** — emailpass provider hoạt động thế nào? Custom provider interface ra sao?"

> "Dùng MCP tra cứu **Auth Flows** — register flow và login flow khác nhau chỗ nào?"

#### Dùng Plugin để hiểu architecture

> "Dựa vào skill `@building-with-medusa`, load reference `authentication.md` và giải thích chi tiết: sự khác biệt giữa `actor_type = 'customer'` vs `'user'`, cách `authenticate` middleware hoạt động, và khi nào dùng `AuthenticatedMedusaRequest`."

> "Dựa vào skill `@building-with-medusa`, load reference `module-links.md` và giải thích cách Auth Module link với Customer Module — link này được tạo khi nào, lưu ở đâu?"

---

### Phase 2C: End-to-End Flows (2 ngày)

**Mục tiêu:** Trace register/login E2E, `createCustomerAccountsWorkflow`, cart merge

#### Dùng MCP để tra cứu

> "Dùng MCP tra cứu **Storefront Register flow** — các bước từ POST /auth/customer/emailpass đến POST /store/customers."

> "Dùng MCP tra cứu **createCustomerAccountsWorkflow** — input/output là gì, các steps bên trong?"

> "Dùng MCP tra cứu **Cart merge** behavior khi customer login — guest cart có tự merge với account cart không?"

#### Dùng Plugin để hiểu workflow patterns

> "Dựa vào skill `@building-with-medusa`, load reference `workflows.md` và giải thích cấu trúc của một Medusa workflow — constraints quan trọng (no async, no arrow functions, no conditionals)."

#### Dùng Storefront Skill (nếu muốn code test page)

> "Dựa vào skill `@building-storefronts`, hướng dẫn mình viết một trang HTML đơn giản để test Register → Login → Get Customer Profile flow bằng Medusa JS SDK."

---

### Phase 3: Architecture Decision Checkpoint (1 ngày)

> **DỪNG CODE. Chỉ nghĩ và quyết định.**

#### Dùng MCP + Plugin kết hợp để ra quyết định

> "Mình cần quyết định **ADR-001: Merge Strategy** cho social login. Dùng MCP tra cứu cách Medusa xử lý khi 2 auth providers cùng email. Sau đó dùng skill `@building-with-medusa` reference `authentication.md` và `module-links.md` để phân tích pros/cons của từng option: auto-merge, verified-merge, no-merge."

> "Mình cần quyết định **ADR-003: Social Profile Storage**. Dùng MCP tra cứu `provider_metadata` trong AuthIdentity lưu được gì. Sau đó dùng skill `@building-with-medusa` reference `custom-modules.md` để so sánh: lưu trong metadata vs tạo custom module SocialProfile."

---

### Phase 4: Google Login (3-4 ngày)

**Mục tiêu:** E2E Google Login, validate merge strategy

#### Dùng MCP để tra cứu setup

> "Dùng MCP tra cứu cách cấu hình **Google Auth Provider** (`@medusajs/auth-google`) — cần config gì trong `medusa-config.ts`, env variables nào?"

> "Dùng MCP tra cứu **Third-Party Login flow** cho storefront — sequence diagram từ redirect đến callback."

#### Dùng Plugin để code đúng chuẩn

> "Dựa vào skill `@building-with-medusa` reference `authentication.md`, hướng dẫn mình config authenticate middleware cho Google login callback route. Lưu ý: route nào cần protect, route nào không?"

> "Dựa vào skill `@building-storefronts`, hướng dẫn mình viết test page HTML/Next.js để trigger Google OAuth flow và xử lý callback."

---

### Phase 5: Custom Auth Provider (4-5 ngày)

**Mục tiêu:** Tự viết Auth Provider (mock → real GitHub)

#### Dùng MCP để tra cứu interface

> "Dùng MCP tra cứu **Auth Provider Interface** — `AuthProviderInterface` cần implement những method nào? `authenticate()`, `validateCallback()` nhận/trả gì?"

#### Dùng Plugin để code đúng architecture

> "Dựa vào skill `@building-with-medusa` reference `custom-modules.md`, hướng dẫn mình tạo thư mục và file structure cho một custom auth provider module."

> "Dựa vào skill `@building-with-medusa` reference `authentication.md`, review giúp mình mock provider code — kiểm tra xem có vi phạm architecture rules nào không."

#### Dùng db-generate & db-migrate Skills

Khi cần tạo/chạy migration cho module mới:

> "Giúp mình chạy db:generate cho module auth provider vừa tạo, rồi db:migrate để áp dụng."

*(AI sẽ tự nạp skill `db-generate` và `db-migrate` để sinh ra đúng lệnh CLI)*

---

### Phase 6: Edge Cases & Extend (3-4 ngày)

**Mục tiêu:** Merge strategy, extend Customer, admin widget

#### Dùng Plugin kết hợp nhiều skills

> "Dựa vào skill `@building-with-medusa` reference `workflow-hooks.md`, hướng dẫn mình hook vào `createCustomerAccountsWorkflow` để implement merge strategy (ADR-001)."

> "Dựa vào skill `@building-with-medusa` reference `module-links.md`, hướng dẫn mình tạo link giữa Customer và custom SocialProfile module."

> "Dựa vào skill `@building-admin-dashboard-customizations`, hướng dẫn mình tạo Admin Widget hiển thị social login info (avatar, provider) trong trang chi tiết Customer."

---

## Tổng hợp: Cheat Sheet nhanh

| Bạn muốn... | Gõ vào chat... |
|---|---|
| Tra cứu docs Medusa mới nhất | "Dùng MCP tra cứu..." |
| Hiểu cách code đúng chuẩn | "Dựa vào skill `@building-with-medusa`..." |
| Tạo Admin Widget / UI Page | "Dựa vào skill `@building-admin-dashboard-customizations`..." |
| Code Storefront gọi API | "Dựa vào skill `@building-storefronts`..." |
| Tạo migration sau khi sửa model | "Giúp mình chạy db:generate cho module X" |
| Chạy migration | "Giúp mình chạy db:migrate" |
| Tạo admin user | "Tạo admin user với email X password Y" |
| Review code theo chuẩn Medusa | "Review code này dựa vào skill `@building-with-medusa` — check vi phạm architecture" |

---

## Quy trình chuẩn cho mỗi bài tập

```
1. TRA CỨU (MCP)     → "Dùng MCP tra cứu [topic] trong docs Medusa"
                         → AI gọi MCP Server lấy docs mới nhất
                         
2. HIỂU PATTERN (Plugin) → "Dựa vào skill @building-with-medusa, giải thích [concept]"  
                            → AI đọc reference file, trả lời kèm code pattern đúng/sai

3. CODE (Plugin)      → "Implement [feature] theo chuẩn Medusa"
                         → AI tự nạp skill + reference, viết code tuân thủ rules

4. VALIDATE (Plugin)  → "Review code vừa viết — check architecture violations"
                         → AI chạy checklist từ SKILL.md, báo lỗi nếu có

5. DB (Skills)        → "Chạy db:generate và db:migrate"
                         → AI nạp skill db-generate/db-migrate, sinh CLI command

6. TEST (MCP)         → "Tra cứu MCP endpoint để test API route vừa tạo bằng cURL"
                         → AI tạo cURL command với đúng headers
```

> [!TIP]
> **Mẹo:** Bạn không cần nhớ tên chính xác của reference files. Chỉ cần mô tả ý định (VD: "mình muốn tạo module", "mình muốn viết workflow"), AI sẽ tự biết cần load reference file nào từ skill.

> [!IMPORTANT]
> **Quan trọng:** MCP và Plugin **bổ trợ lẫn nhau**, không thay thế. MCP cho bạn thông tin **chính xác** (method signature, config option). Plugin cho bạn kiến thức **đúng cách** (architecture rules, anti-patterns). Luôn dùng cả hai khi implement một tính năng mới.
