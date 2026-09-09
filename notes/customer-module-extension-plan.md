# Kế hoạch Triển khai Thực chiến: Extend Customer Module (Tiêu chuẩn Vàng)
*Ngày tạo: 2026-09-09*

## 1. Context (Bối cảnh bài toán)
Mục tiêu: Xây dựng tính năng *"Gửi tin nhắn Welcome (Zalo/Gmail) khi khách hàng đăng ký tài khoản"*. 
Đây là bài thực hành **đủ độ khó và bao quát 100% kiến trúc lõi** của Medusa v2, giúp thấu hiểu luồng dữ liệu (Request Flow) từ lúc API nhận Request cho đến khi Event chạy ngầm.

## 2. Quyết định Kiến trúc (Architectural Decisions)
Để đáp ứng bài toán mà không đụng vào code gốc của Medusa, chúng ta áp dụng 3 "vũ khí" mở rộng mạnh nhất:

1. **API Middleware (Mở cổng Validation):** Dùng Zod để ép kiểu, cho phép truyền trường tùy chỉnh `zalo_id` qua `additional_data` của API mặc định.
2. **Workflow Hook (Lưu DB Đồng bộ):** Bắt `additional_data` và ghi đè vào cột `metadata` bằng tầng thấp nhất `customerModuleService` (để né rủi ro Infinite Loop nếu dùng lại Workflow). Đảm bảo tính toàn vẹn Transaction (Một lỗi -> Hủy tất cả).
3. **Subscriber (Gửi Noti Bất đồng bộ):** Bắt sự kiện `customer.created`. Dùng `setTimeout(3000)` để mô phỏng độ trễ mạng. API gốc vẫn trả về 200 lập tức cho User.

---

## 3. Danh sách Tasks sẽ thực hiện ở Session tiếp theo

- [ ] **Task 1:** Tạo `apps/backend/src/api/middlewares.ts` (Validation dữ liệu đầu vào: `additionalDataValidator`).
- [ ] **Task 2:** Tạo `apps/backend/src/workflows/hooks/user-created.ts` (Thao tác DB đồng bộ: `container.resolve(Modules.CUSTOMER)`).
- [ ] **Task 3:** Tạo `apps/backend/src/subscribers/customer-created.ts` (Xử lý tác vụ ngầm: bắt `customer.created`).
- [ ] **Task 4 (Verify):** Khởi động backend và dùng cURL/Postman bắn thử API `/admin/customers` để quan sát Log chạy.
