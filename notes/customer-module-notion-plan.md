# Plan: Viết tài liệu Customer Module trên Notion (v2 — đã hoàn thiện sau self-review)

## Mục tiêu
Viết tài liệu tinh gọn, cốt lõi về **Medusa Customer Module** trên trang Notion hiện có ("Medusa Customer Module"), giúp dev SmartOSC đọc xong trong **~15 phút** và nắm được toàn bộ bản chất module mà **không cần phải mở docs gốc của Medusa**.

> [!IMPORTANT]
> **Nguyên tắc vàng:** Tài liệu này là "bản đồ kho báu", KHÔNG phải "cuốn bách khoa toàn thư". Chỉ viết những gì dev CẦN BIẾT để làm việc, không copy-paste docs Medusa.

---

## Thay đổi so với Plan v1

| # | Vấn đề | Cách fix |
|---|---|---|
| 1 | Thiếu bảng `customer_account_holder` | ✅ Đã query DB, bổ sung vào Phase 1 |
| 2 | Chưa biết email có UNIQUE constraint không | ✅ Đã xác minh: UNIQUE trên `(email, has_account)` WHERE `deleted_at IS NULL` |
| 3 | Thiếu giải thích Soft Delete | ✅ Bổ sung vào Phase 1 |
| 4 | Phase 4 (Extend) đứng trước Phase 5 (API) — sai logic | ✅ Đã đảo: API trước, Extend sau |
| 5 | API endpoints chưa được xác minh | ✅ Đã scan source code Medusa v2.20.1 thực tế |

---

## Phát hiện quan trọng từ DB

### 1. Bảng `customer_account_holder`
```sql
- customer_id (varchar, NOT NULL)
- account_holder_id (varchar, NOT NULL)
- PRIMARY KEY (customer_id, account_holder_id)
```
→ Đây là **bảng Module Link** giữa Customer Module và Auth Module. Nó nối `customer_id` với `account_holder_id` (từ Auth Module). Bảng này tự động được điền khi khách hàng đăng ký tài khoản.

### 2. UNIQUE Index trên email
```sql
CREATE UNIQUE INDEX "IDX_customer_email_has_account_unique" 
ON public.customer USING btree (email, has_account) 
WHERE (deleted_at IS NULL);
```
→ **Ý nghĩa cực kỳ quan trọng:**
- Email + has_account CÙNG NHAU mới là unique (compound unique)
- Nghĩa là: **CÓ THỂ** tồn tại 2 record cùng email `abc@gmail.com`, với điều kiện 1 cái `has_account=false` (Guest) và 1 cái `has_account=true` (Registered)
- Nhưng **KHÔNG THỂ** tồn tại 2 Guest cùng email, hoặc 2 Registered cùng email
- Chỉ áp dụng cho record chưa bị soft delete (`deleted_at IS NULL`)

---

## Cấu trúc trang Notion (đã cập nhật)

```text
📄 Medusa Customer Module (Trang gốc — đã có sẵn)
│
├── 🎯 TL;DR — Tóm tắt 30 giây
│
├── Phase 1: Bản chất Module
│   ├── Nó làm gì / Nó KHÔNG làm gì
│   ├── 5 Bảng DB (bao gồm customer_account_holder)
│   ├── Sơ đồ quan hệ
│   └── Soft Delete: Xóa ≠ Mất
│
├── Phase 2: Cờ `has_account` & Email Uniqueness
│   ├── Guest vs Registered
│   └── UNIQUE(email, has_account) — phân tích kỹ
│
├── Phase 3: Impact — Module khác bám vào Customer thế nào?
│   └── Bảng tóm tắt: Cart, Order, Promotion, Auth
│
├── Phase 4: API & Workflow có sẵn (CÁI GÌ ĐÃ CÓ?)
│   ├── Store API (cho Frontend/Storefront)
│   └── Admin API (cho Admin Dashboard)
│
├── Phase 5: Cách mở rộng (KHI CÁI CÓ SẴN KHÔNG ĐỦ)
│   ├── metadata (JSONB) vs Extend Data Model
│   └── Khi nào chọn cách nào?
│
└── 📎 Links tham khảo docs gốc
```

---

## Chi tiết nội dung từng Phase

### 🎯 TL;DR — Tóm tắt 30 giây

> Callout box ngắn gọn. Dev đọc mỗi phần này cũng đã nắm được 80%.

- Customer Module = "Kho danh bạ khách hàng". Chỉ lưu trữ, KHÔNG xử lý đăng nhập.
- 3 bảng chính: `customer`, `customer_address`, `customer_group` + 2 bảng liên kết.
- Cờ `has_account` (boolean) — phân biệt Guest vs Registered. Email unique theo cặp `(email, has_account)`.
- Hoàn toàn Isolated — các module khác bám vào nó, nó không phụ thuộc ai.
- Xóa = Soft delete (`deleted_at`), dữ liệu vẫn còn trong DB.

---

### Phase 1: Bản chất Module

**1a. Nó làm gì / Nó KHÔNG làm gì:**

| ✅ Nó LÀM | ❌ Nó KHÔNG LÀM |
|---|---|
| Lưu thông tin cá nhân (tên, email, SĐT) | Lưu password/token |
| Lưu nhiều địa chỉ giao hàng/thanh toán | Xử lý đăng nhập/xác thực |
| Phân nhóm khách hàng (VIP, Wholesale...) | Gửi email, notification |
| Cung cấp trường `metadata` (JSONB) mở rộng tùy ý | Tính toán giá, khuyến mãi |

**1b. 5 Bảng DB thực tế** (đã xác minh từ DB Medusa v2.20.1):

| Bảng | Các cột quan trọng | Vai trò |
|---|---|---|
| `customer` | `id`, `email`, `first_name`, `last_name`, `phone`, `has_account`, `metadata`, `created_by` | Bảng trung tâm |
| `customer_address` | `customer_id`, `address_1`, `city`, `country_code`, `is_default_shipping`, `is_default_billing` | 1 customer → N addresses |
| `customer_group` | `id`, `name`, `metadata` | Nhóm khách hàng |
| `customer_group_customer` | `customer_id`, `customer_group_id` | Bảng trung gian N-N |
| `customer_account_holder` | `customer_id`, `account_holder_id` | Module Link → Auth Module |

**1c. Sơ đồ quan hệ:**
```text
Customer (1) ──→ (N) CustomerAddress
Customer (N) ←──→ (N) CustomerGroup        [qua customer_group_customer]
Customer (1) ←──→ (1) AccountHolder         [qua customer_account_holder → Auth Module]
```

**1d. Soft Delete:**
- Tất cả bảng đều có cột `deleted_at`.
- Khi gọi `deleteCustomers()`, Medusa KHÔNG xóa record khỏi DB mà chỉ ghi timestamp vào `deleted_at`.
- Truy vấn thông thường tự động filter `WHERE deleted_at IS NULL`.
- Dev kiểm tra DB thấy "record vẫn còn" → đó là bình thường, không phải bug.

---

### Phase 2: Cờ `has_account` & Email Uniqueness

**2a. Guest vs Registered:**
- `has_account = false` → Guest: Medusa tự tạo khi khách guest checkout.
- `has_account = true` → Registered: Khách đã đăng ký tài khoản chính thức.

**2b. UNIQUE constraint thực tế:**
```sql
UNIQUE(email, has_account) WHERE deleted_at IS NULL
```
Bảng phân tích tình huống:

| Tình huống | Cho phép? | Giải thích |
|---|---|---|
| Guest `abc@gmail.com` + Registered `abc@gmail.com` | ✅ Được | Khác `has_account` |
| 2 Guest cùng `abc@gmail.com` | ❌ Không | Trùng cả email lẫn `has_account=false` |
| 2 Registered cùng `abc@gmail.com` | ❌ Không | Trùng cả email lẫn `has_account=true` |
| Guest `abc@gmail.com` (đã soft delete) + Guest mới `abc@gmail.com` | ✅ Được | Record cũ đã bị loại khỏi index |

---

### Phase 3: Impact — Module khác bám vào Customer thế nào?

| Module | Bám vào cái gì? | Ví dụ thực tế |
|---|---|---|
| **Cart** | `customer_id` | Gắn giỏ hàng cho khách đăng nhập |
| **Order** | `customer_id` | Lưu lịch sử đơn hàng |
| **Promotion** | `customer_group_id` | Giảm giá riêng cho nhóm VIP |
| **Auth** | `customer_account_holder` | Liên kết tài khoản login ↔ Customer |

> Customer Module KHÔNG import hay phụ thuộc vào bất kỳ module nào. Nó chỉ "bị bám vào".

---

### Phase 4: API & Workflow có sẵn (đã xác minh từ source code v2.20.1)

**Store API** (cho Frontend — cần Auth token):

| Method | Endpoint | Chức năng |
|---|---|---|
| `POST` | `/store/customers` | Đăng ký khách hàng mới |
| `GET` | `/store/customers/me` | Xem thông tin cá nhân |
| `POST` | `/store/customers/me` | Cập nhật thông tin cá nhân |
| `GET` | `/store/customers/me/addresses` | Xem danh sách địa chỉ |
| `POST` | `/store/customers/me/addresses` | Thêm địa chỉ mới |
| `GET` | `/store/customers/me/addresses/:id` | Xem 1 địa chỉ cụ thể |
| `POST` | `/store/customers/me/addresses/:id` | Cập nhật 1 địa chỉ |
| `DELETE` | `/store/customers/me/addresses/:id` | Xóa 1 địa chỉ |

**Admin API** (cho Dashboard — cần Admin token):

| Method | Endpoint | Chức năng |
|---|---|---|
| `GET` | `/admin/customers` | Danh sách tất cả khách hàng |
| `POST` | `/admin/customers` | Tạo khách hàng mới |
| `GET` | `/admin/customers/:id` | Xem chi tiết 1 khách hàng |
| `POST` | `/admin/customers/:id` | Cập nhật thông tin |
| `DELETE` | `/admin/customers/:id` | Xóa (soft delete) |
| `GET` | `/admin/customers/:id/addresses` | Danh sách địa chỉ |
| `POST` | `/admin/customers/:id/addresses` | Thêm địa chỉ |
| `POST` | `/admin/customers/:id/customer-groups` | Gắn vào nhóm |

---

### Phase 5: Cách mở rộng

| | Dùng `metadata` (JSONB) | Extend Data Model |
|---|---|---|
| **Khi nào** | Dữ liệu phụ, không cần query/filter | Dữ liệu quan trọng, cần query/sort |
| **Ví dụ** | `avatar_url`, `facebook_id`, ghi chú | `date_of_birth`, `loyalty_tier` |
| **Ưu** | Zero migration, deploy ngay | Type-safe, indexable |
| **Nhược** | Không query/sort, không type-safe | Cần `db:generate` + `db:migrate` |

---

### 📎 Links tham khảo
- [Customer Module Overview](https://docs.medusajs.com/resources/commerce-modules/customer)
- [Customer Data Model](https://docs.medusajs.com/resources/references/customer/models/Customer)
- [Extend Module Guide](https://docs.medusajs.com/resources/commerce-modules/customer/extend)

---

## Quy trình thực thi

| Bước | Hành động | Trạng thái |
|---|---|---|
| 1 | Fix Notion MCP 401 (cần user kết nối Integration vào page) | ⬜ Chờ user |
| 2 | Tìm Page ID của trang "Medusa Customer Module" | ⬜ Chờ bước 1 |
| 3 | Viết nội dung markdown theo cấu trúc trên | ⬜ Sẵn sàng |
| 4 | Push nội dung lên Notion qua MCP `API-update-page-markdown` | ⬜ Chờ bước 2 |
| 5 | Review trên Notion và điều chỉnh format | ⬜ Chờ bước 4 |

> [!WARNING]
> **Blocker hiện tại:** Notion MCP đang bị lỗi 401 Unauthorized khi truy cập trang Notion. Ngày mai khi bắt đầu, bạn chỉ cần vào Notion → mở trang "Medusa Customer Module" → click menu `...` (góc phải trên) → chọn **Connect to** → chọn Notion Integration của bạn. Sau đó AI sẽ tự động push toàn bộ nội dung lên Notion ngay.
