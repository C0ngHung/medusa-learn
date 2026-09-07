# Kế hoạch Học tập & Thực hành: Medusa Customer Module (v2)

> **Mục tiêu:** Nắm vững Customer Module trong MedusaJS v2, hiểu rõ cách nó liên kết với các module khác, và sẵn sàng triển khai task tích hợp Social Login (Google, Facebook, Zalo, TikTok...) trong dự án thực tế tại SmartOSC.
>
> **Cập nhật lần cuối:** 2026-09-08
> **Trạng thái:** Đã duyệt — Chưa bắt đầu

---

## Tổng quan Phases

| Phase | Nội dung | Thời gian | Trạng thái |
|---|---|---|---|
| 1 | Cài đặt Medusa & Hiểu kiến trúc | 2-3 ngày | ✅ Đã hoàn thành |
| 2 | Deep Dive Customer + Auth Module | 5-6 ngày | ⬜ Chưa bắt đầu |
| 3 | Architecture Decision Checkpoint | 1 ngày | ⬜ Chưa bắt đầu |
| 4 | Google Login Integration | 3-4 ngày | ⬜ Chưa bắt đầu |
| 5 | Custom Auth Provider (Mock → Real) | 4-5 ngày | ⬜ Chưa bắt đầu |
| 6 | Edge Cases & Extend Customer Module | 3-4 ngày | ⬜ Chưa bắt đầu |

**Tổng thời gian ước tính:** 18-23 ngày làm việc

---

## 1. Tổng quan Customer Module mặc định

Customer Module là một [Commerce Module](https://docs.medusajs.com/resources/commerce-modules/customer) cung cấp sẵn các tính năng quản lý khách hàng.

### 1.1. Data Models

| Data Model | Mô tả | Các field chính |
|---|---|---|
| **Customer** | Thực thể khách hàng chính | `id`, `email`, `first_name`, `last_name`, `phone`, `company_name`, `has_account` (boolean), `metadata` (JSON) |
| **CustomerGroup** | Nhóm khách hàng (VIP, Wholesale...) | `id`, `name`, `metadata` |
| **CustomerAddress** | Địa chỉ của khách hàng | `id`, `customer_id`, `address_name`, `first_name`, `last_name`, `company`, `address_1`, `address_2`, `city`, `province`, `postal_code`, `country_code`, `phone`, `is_default_shipping`, `is_default_billing`, `metadata` |
| **CustomerGroupCustomer** | Bảng trung gian Customer ↔ Group | `id`, `customer_id`, `customer_group_id` |

### 1.2. Tính năng mặc định

- **Quản lý Customer:** CRUD thông tin khách hàng
- **Registered vs Guest:** `has_account = true` vs `has_account = false`
- **Customer Groups:** Phân nhóm để áp giá đặc biệt, khuyến mãi
- **Customer Addresses:** Nhiều địa chỉ giao hàng/thanh toán
- **Admin API + Store API Endpoints:** Đầy đủ

### 1.3. Điểm quan trọng: `has_account`

- **`false` (Guest):** Tạo khi checkout không đăng nhập. Chỉ có email.
- **`true` (Registered):** Đăng ký tài khoản. Liên kết với Auth Identity.

> **QUAN TRỌNG:** Customer Module KHÔNG xử lý authentication. Auth Module đảm nhiệm. Hai module liên kết qua Module Links.

---

## 2. Các khái niệm cốt lõi

### 2.1. Kiến trúc

```
┌─────────────────────────────────────────────────────┐
│                    Medusa Application               │
│                                                     │
│  ┌──────────────┐  Module Link  ┌────────────────┐  │
│  │ Auth Module   │◄────────────►│ Customer Module│  │
│  │              │               │                │  │
│  │ AuthIdentity │───links to───►│ Customer       │  │
│  │ AuthProvider │               │ CustomerGroup  │  │
│  │              │               │ CustomerAddress│  │
│  └──────────────┘               └────────────────┘  │
│         │                              │            │
│         │ Module Link                  │ Module Link│
│         ▼                              ▼            │
│  ┌──────────────┐               ┌────────────────┐  │
│  │ Cart Module   │               │ Order Module   │  │
│  └──────────────┘               └────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 2.2. Bảng khái niệm

| Khái niệm | Mô tả | Tại sao quan trọng |
|---|---|---|
| **Module** | Package độc lập, 1 domain | Isolated — không share database |
| **Module Link** | Liên kết dữ liệu giữa 2 module | Customer ↔ AuthIdentity qua link, không foreign key |
| **Service** | Business logic, tạo bởi Service Factory | `CustomerModuleService` |
| **Data Model** | Schema dữ liệu bằng DML | Medusa DML, không phải TypeORM |
| **Workflow** | Chuỗi bước có rollback | `createCustomerAccountsWorkflow` |
| **Auth Identity** | Bản ghi xác thực | `actor_type = "customer"` link tới Customer |
| **Auth Provider** | Plugin xử lý auth method | `emailpass`, `google`, custom |
| **Query** | Truy vấn xuyên module | Lấy Customer + AuthIdentity + Orders |

---

## 3. Customer Module liên kết với các Module khác

| Module | Kiểu liên kết | Ảnh hưởng |
|---|---|---|
| **Auth** | AuthIdentity ↔ Customer (1:1) | Register → tạo AuthIdentity → link Customer |
| **Cart** | Cart → Customer | Cart gắn customer, cart merge khi login |
| **Order** | Order → Customer | Lịch sử đơn hàng |
| **Promotion** | Promotion → CustomerGroup | Khuyến mãi theo nhóm |
| **Pricing** | PriceList → CustomerGroup | Giá đặc biệt theo nhóm |

### 3.1. Checklist khi customize Customer Module

- [ ] Admin API & Store API có trả field mới không?
- [ ] Admin Dashboard hiển thị field mới không? Cần widget?
- [ ] Workflows mặc định có xử lý field mới không? Cần hook?
- [ ] Cart/Order linking có bị ảnh hưởng không?

---

## 4. Quy trình Social Login

### 4.1. Auth Flow

```
Storefront                              Medusa Backend
    │                                        │
    │ 1. POST /auth/customer/{provider}      │
    │───────────────────────────────────────►│
    │ 2. { location: "oauth_url" }           │
    │◄───────────────────────────────────────│
    │ 3. Redirect → OAuth provider           │
    │───────────────────────────────────────►│ Provider
    │ 4. Callback ?code=xxx                  │
    │◄───────────────────────────────────────│
    │ 5. POST /auth/customer/{provider}/     │
    │    callback?code=xxx                   │
    │───────────────────────────────────────►│
    │ 6. { token: "jwt..." }                 │ → Tạo/tìm AuthIdentity
    │◄───────────────────────────────────────│
    │ 7. GET /store/customers/me             │
    │───────────────────────────────────────►│
    │    (nếu 404 → POST /store/customers)   │
```

### 4.2. Customer Module xử lý thế nào

**Case 1: Customer mới** → Tạo Customer + Link AuthIdentity
**Case 2: Guest cùng email** → Upgrade `has_account: false → true`, giữ order history
**Case 3: Đã có account khác provider** → Cần merge strategy (ADR-001)

### 4.3. Edge Cases

| # | Edge Case | Mức nghiêm trọng |
|---|---|---|
| EC-1 | Provider không trả email (Apple, TikTok) | 🔴 Cao |
| EC-2 | Cart merge khi login (guest cart vs account cart) | 🔴 Cao |
| EC-3 | Email chưa verified → security risk khi auto-merge | 🔴 Cao |
| EC-4 | User đổi email trên provider, entity_id giữ nguyên | 🟡 TB |
| EC-5 | Account deletion (GDPR/PDPA) | 🟡 TB |
| EC-6 | Rate limiting auth endpoints | 🟢 Thấp |

### 4.4. Social Profile Data

| Data | Lưu ở đâu | Lý do |
|---|---|---|
| Provider ID | `AuthIdentity.provider_metadata` | Identify user |
| Email | `Customer.email` | Default field |
| Name | `Customer.first_name/last_name` | Default field |
| Avatar | Custom field/module | Không có sẵn |
| Phone | `Customer.phone` | Default field |
| Access/Refresh token | `AuthIdentity.provider_metadata` | Gọi API provider |
| `email_verified` | `AuthIdentity.provider_metadata` | Merge strategy |

---

## 5. Kế hoạch chi tiết

---

### Phase 1: Cài đặt & Kiến trúc (2-3 ngày)

**Mục tiêu:** Chạy Medusa v2 local, hiểu kiến trúc Module/Link/Workflow

**Việc cần làm:**
1. Cài Node.js (v20+), PostgreSQL (v15+)
2. `npx create-medusa-app@latest` trong workspace
3. Khởi động backend + admin
4. Gọi thử Store API và Admin API (Postman/curl)
5. Đọc cấu trúc thư mục: `src/`, `medusa-config.ts`

**Tài liệu:**
- [Installation](https://docs.medusajs.com/learn/installation)
- [Architecture](https://docs.medusajs.com/learn/introduction/architecture)
- [Modules](https://docs.medusajs.com/learn/fundamentals/modules)
- [Module Links](https://docs.medusajs.com/learn/fundamentals/module-links)
- [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows)
- [Store API](https://docs.medusajs.com/api/store) | [Admin API](https://docs.medusajs.com/api/admin)

**Output:** `notes/phase1-architecture.md`

**Checklist:**
- [ ] Medusa chạy không lỗi
- [ ] Admin Dashboard accessible (`localhost:9000/app`)
- [ ] `GET /store/products` thành công
- [ ] Giải thích được: Module, isolation, Module Link
- [ ] Vẽ được sơ đồ request flow

**Lưu ý:**
- ⚠️ PostgreSQL phải chạy trước
- ⚠️ Windows + sharp: `npm install --platform=win32 sharp`
- ⚠️ Node.js >= 20

---

### Phase 2: Customer + Auth Module Deep Dive (5-6 ngày)

#### Sub-phase 2A: Customer Module Data & CRUD (2 ngày)

**Mục tiêu:** Data model, service, API endpoints, `has_account`, groups, addresses

**Việc cần làm:**
1. Explore schema bằng DML Reference + pgAdmin (không đọc node_modules)
2. Admin Dashboard: tạo customer, group, gán customer
3. Store API: test CRUD

**Bài thực hành:**
- 2A-1: Customer Group & Pricing (tạo group VIP, price list riêng)
- 2A-2: Address Management (CRUD, default shipping/billing)

**Tài liệu:**
- [Customer Module](https://docs.medusajs.com/resources/commerce-modules/customer)
- [Customer Accounts](https://docs.medusajs.com/resources/commerce-modules/customer/customer-accounts)
- [Links to Other Modules](https://docs.medusajs.com/resources/commerce-modules/customer/links-to-other-modules)
- [DML Reference](https://docs.medusajs.com/resources/references/data-model)

---

#### Sub-phase 2B: Auth Module Concepts (1-2 ngày)

**Mục tiêu:** AuthIdentity, Actor Type, Provider, JWT, Module Link Auth↔Customer

**Việc cần làm:**
1. Đọc tài liệu Auth Module
2. Kiểm tra DB: `auth_identity`, `provider_identity`
3. So sánh `actor_type = "customer"` vs `"user"`

**Tài liệu:**
- [Auth Module](https://docs.medusajs.com/resources/commerce-modules/auth)
- [Auth Identity & Actor Types](https://docs.medusajs.com/resources/commerce-modules/auth/auth-identity-and-actor-types)
- [Auth Flows](https://docs.medusajs.com/resources/commerce-modules/auth/auth-flows)
- [Auth Providers](https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers)
- [Protected Routes](https://docs.medusajs.com/learn/fundamentals/api-routes/protected-routes)

---

#### Sub-phase 2C: End-to-End Flows (2 ngày)

**Mục tiêu:** Trace register/login E2E, `createCustomerAccountsWorkflow`, cart merge

**Bài thực hành:**
- 2C-1: Full Register/Login Flow (register → login → tạo customer → verify DB)
- 2C-2: Guest → Registered Flow (checkout guest → register cùng email → verify order history)
- 2C-3: Cart Merge khi Login (guest cart + account cart → observe behavior)

**Tài liệu:**
- [Storefront: Register](https://docs.medusajs.com/resources/storefront-development/customers/register)
- [Storefront: Login](https://docs.medusajs.com/resources/storefront-development/customers/login)
- [Core Workflows Reference](https://docs.medusajs.com/resources/medusa-workflows-reference)

---

**Output Phase 2:** `notes/phase2-customer-auth.md` + Postman Collection

**Checklist Phase 2:**
- [ ] Guest vs registered customer — giải thích được
- [ ] CRUD customer qua Store API
- [ ] Address management
- [ ] Customer groups
- [ ] AuthIdentity, actor_type — giải thích được
- [ ] Register flow traced qua DB
- [ ] JWT token contents — giải thích được
- [ ] emailpass provider vs custom provider — phân biệt được
- [ ] Cart merge behavior — tested và ghi lại
- [ ] `createCustomerAccountsWorkflow` — hiểu được

**Lưu ý:**
- ⚠️ Store API cần header `x-publishable-api-key`
- ⚠️ Register chỉ tạo AuthIdentity, phải `POST /store/customers` để tạo Customer
- ⚠️ Cart merge behavior có thể khác giữa versions — test thực tế

---

### Phase 3: Architecture Decision Checkpoint (1 ngày)

> **DỪNG CODE.** Think before implement. Quyết định ghi thành document.

**ADR-001: Merge Strategy** — Chọn 1:
- (A) Auto-merge theo email
- (B) Verified-merge (chỉ merge nếu email verified)
- (C) No-merge (tạo riêng)

**ADR-002: Email ẩn** — Chọn 1:
- (A) Bắt nhập email bổ sung
- (B) Placeholder email
- (C) Block đăng ký

**ADR-003: Social Profile Storage** — Chọn 1:
- (A) `provider_metadata` only
- (B) Custom module `SocialProfile`
- (C) Extend Customer fields

**Hỏi team câu hỏi Section 7.**

**Output:** `notes/phase3-adr.md`

**Checklist:**
- [ ] ADR-001 decided
- [ ] ADR-002 decided
- [ ] ADR-003 decided
- [ ] Team questions asked

---

### Phase 4: Google Login (3-4 ngày)

**Mục tiêu:** E2E Google Login, validate merge strategy

**Việc cần làm:**
1. Tạo Google OAuth credentials
2. Cấu hình `@medusajs/auth-google`
3. Viết test page (HTML/Next.js)
4. Test: user mới, guest cùng email, account khác provider cùng email
5. Kiểm tra `provider_metadata` và `email_verified`

**Bài thực hành:**
- 4-1: E2E Google Login flow
- 4-2: Database state inspection
- 4-3: Merge strategy validation

**Tài liệu:**
- [Google Auth Provider](https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers/google)
- [Third-Party Login](https://docs.medusajs.com/resources/storefront-development/customers/third-party-login)

**Output:** `notes/phase4-google-login.md`

**Checklist:**
- [ ] Google Login E2E works
- [ ] Customer record correct
- [ ] AuthIdentity + Provider Identity correct
- [ ] Module Link exists
- [ ] `provider_metadata` has Google info + `email_verified`
- [ ] Merge strategy validated

**Lưu ý:**
- ⚠️ Callback URL must match Google Console exactly
- ⚠️ Localhost OK for Google dev
- ⚠️ CORS configuration

---

### Phase 5: Custom Auth Provider (4-5 ngày)

#### Sub-phase 5A: Mock Provider (1-2 ngày)
- Hiểu `AuthProviderInterface` không bị block bởi external credentials
- Tạo fake provider mô phỏng OAuth flow
- Focus: interface contract, return types, error handling

#### Sub-phase 5B: Real Provider — GitHub (2-3 ngày)
- Apply mock knowledge vào provider thật
- OAuth 2.0 exchange: code → token → user info
- Handle edge cases theo ADR

**Tài liệu:**
- [Auth Provider Interface](https://docs.medusajs.com/resources/references/auth/provider)

**Output:** `notes/phase5-custom-provider.md` + reusable template

**Checklist:**
- [ ] Mock provider E2E works
- [ ] Real provider (GitHub) E2E works
- [ ] Customer created from social profile
- [ ] `provider_metadata` correct
- [ ] Error handling (denied permission, expired token)
- [ ] Reusable template ready

**Lưu ý:**
- ⚠️ Facebook/TikTok cần HTTPS callback (dùng ngrok)
- ⚠️ Zalo OAuth khác chuẩn OAuth 2.0
- ⚠️ Normalize user info format giữa providers

---

### Phase 6: Edge Cases & Extend (3-4 ngày)

**Việc cần làm:**
1. Implement merge strategy (ADR-001)
2. Extend Customer data (ADR-003)
3. Handle email ẩn (ADR-002, EC-1)
4. Admin Widget hiển thị social info

**Tài liệu:**
- [Extend Customer Module](https://docs.medusajs.com/resources/commerce-modules/customer/extend)
- [Module Links](https://docs.medusajs.com/learn/fundamentals/module-links)
- [Workflow Hooks](https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks)
- [Admin Widgets](https://docs.medusajs.com/learn/fundamentals/admin/widgets)

**Output:** `notes/phase6-edge-cases.md`

**Checklist:**
- [ ] Multi-provider same email → 1 Customer (if ADR-001 = merge)
- [ ] Custom field/module stores social data (if ADR-003)
- [ ] Admin Widget shows social info
- [ ] Email ẩn handled (EC-1)
- [ ] ≥1 integration test for merge logic

---

## 6. Checklist tổng kết

| # | Kết quả | Phase |
|---|---|---|
| 1 | Medusa local, hiểu kiến trúc | 1 |
| 2 | CRUD Customer, guest vs registered | 2A |
| 3 | Auth Identity, actor_type, JWT | 2B |
| 4 | Register/login E2E, cart merge | 2C |
| 5 | ADR documented | 3 |
| 6 | Google Login E2E | 4 |
| 7 | Custom Auth Provider (mock + real) | 5 |
| 8 | Edge cases, extend, admin widget | 6 |
| 9 | Postman Collection đầy đủ | 2-5 |
| 10 | Notes cho mỗi phase | All |
| 11 | Sẵn sàng nhận task thực tế | 6 |

---

## 7. Câu hỏi cần làm rõ

> Câu 1-4: trước Phase 3. Câu 5-7: trước Phase 4-5.

1. **Module thứ hai** được phân là gì? Liên quan Customer không?
2. **Social providers cụ thể** dự án sẽ dùng?
3. **Storefront technology** đã chọn?
4. **Merge strategy** business muốn approach nào?
5. **Social profile data** cần lưu gì ngoài email/name?
6. **Timeline** deadline sẵn sàng cho dự án?
7. **Centralized auth service** team đã có chưa? (Auth0, Keycloak, Cognito...)
