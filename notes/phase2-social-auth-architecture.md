# Kiến trúc Tích hợp Customer & Auth Module (Medusa v2)

> Nguồn: Tổng hợp từ tài liệu chính thức của Medusa qua AI Chatbot (Bloom). Phục vụ cho Phase 2 & Phase 3.

## 1. Sự Độc Lập Giữa Customer và Auth Module

Trong Medusa v2, **Auth Module hoàn toàn tách biệt với Customer Module**. 
- Customer Module: Quản lý thông tin hiển thị và giao dịch thương mại (`id`, `email`, `first_name`, `last_name`, `has_account`, v.v.). KHÔNG lưu mật khẩu hay thông tin đăng nhập.
- Auth Module: Quản lý định danh (`AuthIdentity`), chứa các thông tin xác thực từ provider (như Google, Facebook), token, `provider_identities`. Auth Module không trực tiếp lưu trữ hay quản lý bảng khách hàng.

Khách hàng (Customer) được coi là một **Actor Type** có tên là `customer` trong hệ thống Auth.

## 2. Cơ Chế Liên Kết (Module Links)

Vì không dùng khóa ngoại (Foreign Key) trực tiếp giữa 2 module, Medusa sử dụng cơ chế liên kết qua trường `app_metadata` trên `AuthIdentity`.

Khi một `AuthIdentity` được gán cho một khách hàng, ID của khách hàng sẽ được lưu dưới dạng:
```json
{
  "app_metadata": {
    "customer_id": "cus_123"
  }
}
```
*(Khóa theo cú pháp `{actor_type}_id`)*

Việc liên kết này được thực hiện thông qua workflow step: `setAuthAppMetadataStep`.

## 3. Luồng Tích Hợp Social Login (OAuth)

Medusa cung cấp sẵn các Auth Provider chính thức gồm `emailpass`, `google`, `github`.
Các API route mặc định để xử lý luồng OAuth:
- **Khởi tạo:** `GET /auth/{actor_type}/{provider}` (Trả về redirect URL/location đến trang đăng nhập của Provider).
- **Callback:** `POST /auth/{actor_type}/{provider}/callback` (Nhận state/code từ provider và xác thực).
- **Refresh:** `POST /auth/token/refresh` (Làm mới token).

### Quy trình phía Storefront:
1. Storefront gọi API khởi tạo `/auth/customer/{provider}` để lấy URL chuyển hướng.
2. User đăng nhập trên Google/Zalo.
3. Provider redirect về Storefront (Callback page) kèm theo `code` và `state`.
4. Storefront gửi các tham số này lên Medusa Backend qua `/auth/customer/{provider}/callback`.
5. Backend giải mã token nhận được:
   - Nếu chưa có `actor_id` (Tài khoản mới): Storefront cần gọi `/store/customers` để tạo Customer record, sau đó gọi liên kết (hoặc gọi `/auth/token/refresh` tùy logic).
   - Nếu đã có `actor_id`: Đăng nhập thành công.

## 4. Xử Lý Liên Kết Tài Khoản (Account Linking)

Nếu khách hàng đã tồn tại trước đó (ví dụ đăng ký bằng `emailpass`) và đăng nhập bằng Social Auth có cùng email, hệ thống cần một cơ chế để link tài khoản thay vì tạo mới (tránh lỗi trùng email):
- **Workflow (VD: `linkCustomerIdentityWorkflow`):** Đọc `auth_identity_id` mới tạo từ Social, tìm Customer khớp email bằng `useQueryGraphStep`, sau đó gọi `setAuthAppMetadataStep` để chèn `customer_id` vào `AuthIdentity` mới.
- **API Route:** Viết thêm một API Route (VD: `POST /auth/link`) để trigger workflow này.

## 5. Tạo Custom Auth Provider (VD: Zalo)

Với các nền tảng không có sẵn (như Zalo, TikTok), ta cần:
1. Tạo một Provider module mới (VD: `src/modules/zalo-auth`).
2. Kế thừa class `AbstractAuthModuleProvider` từ `@medusajs/framework/utils`.
3. Định nghĩa tĩnh `identifier` (VD: `"zalo"`).
4. Triển khai các hàm bắt buộc: Xử lý redirect URL, và validate callback logic (đổi code lấy token và user info).
