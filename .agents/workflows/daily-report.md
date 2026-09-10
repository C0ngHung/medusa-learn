---
description: Tự Động Viết Báo Cáo Hàng Ngày Trên LarkSuite
---

# /daily-report - Tự Động Viết Báo Cáo Hàng Ngày Trên LarkSuite

$ARGUMENTS

---

## 🎯 Mục Đích
Lệnh `/daily-report` tự động hoá việc thu thập thông tin làm việc trong ngày, dịch sang ngôn ngữ kỹ thuật chuyên nghiệp, và đẩy lên LarkSuite Base sau khi được User phê duyệt.

## 🔴 CRITICAL RULES
1. **Lệnh Update:** BẮT BUỘC dùng MCP tool `bitable_v1_appTableRecord_update` từ `larksuite` server.
2. **Nguồn dữ liệu tham khảo ưu tiên:** 
   - `git log --oneline --since="24 hours ago"`
   - File `memory-bank/activeContext.md` (không đọc các file quá lớn).
   - Dữ liệu thô từ LarkSuite.
3. **Approval Gate (Cổng Duyệt):** BẠN (AGENT) TUYỆT ĐỐI KHÔNG ĐƯỢC GỌI TOOL UPDATE LÊN LARK KHI CHƯA TRÌNH BÀY NHÁP VÀ ĐƯỢC USER CHẤP THUẬN!

---

## 🛠 QUY TRÌNH THỰC THI (4 Giai Đoạn)

### Giai Đoạn 1: GATHER CONTEXT (Thu thập Dữ Liệu)
1. **Timezone:** Tính toán thời gian từ `00:00:00` đến `23:59:59` của ngày hôm nay theo giờ **GMT+7**.
2. **Fetch LarkSuite:** Dùng tool `call_mcp_tool` gọi `bitable_v1_appTableRecord_search` vào Base `QVDbbGjeEaiqPcsa4nIj2Dt5pBe` (Table `tblXMNxoCdfjmAlq`).
   - Lọc theo **Assignee:** `Công Hùng Đào`.
   - Lọc theo khoảng thời gian `Date` của ngày hôm nay.
   - Báo lỗi rõ ràng và DỪNG nếu không tìm thấy task nào (Empty State).
3. **Fetch Local Context:** Chạy lệnh `git log` để lấy các commit mới nhất và đọc file `activeContext.md` (nếu có).

### Giai Đoạn 2: SYNTHESIZE & DRAFT (Tổng Hợp & Bản Nháp)
1. Dựa trên dữ liệu đã thu thập, viết lại `Description` cho từng task đã lấy từ LarkSuite.
2. **Văn phong:** Sử dụng ngôn ngữ kỹ thuật phần mềm cao cấp (Professional & Technical terms: ví dụ System Analysis, DB Normalization, Core Codebase, Business Workflows).
3. Sử dụng dạng Bullet points cho rõ ràng.
4. **Hiển thị cho User:** In ra màn hình console / chat toàn bộ danh sách các bản nháp này để User xem.

### Giai Đoạn 3: APPROVAL GATE (Dừng & Chờ Duyệt)
1. In ra câu hỏi: `"Bạn có đồng ý update các thông tin này lên LarkSuite không? Hãy phản hồi OK hoặc yêu cầu chỉnh sửa."`
2. **DỪNG LUỒNG THỰC THI (Stop Execution).** KHÔNG gộp chung bước update vào lượt này.

### Giai Đoạn 4: UPDATE (Đồng Bộ)
*(Chỉ chạy khi User đã phản hồi "OK")*
1. Gọi `bitable_v1_appTableRecord_update` để đẩy tất cả các string Description dạng plain text lên LarkSuite cho từng `record_id`.
2. Báo cáo thành công cho User.

---

## 💡 Ví dụ Kết quả Nháp
**Task:** `Init project medusa-learn`
**Description mới:**
- Nghiên cứu kiến trúc tổng thể và khởi tạo môi trường phát triển (development environment) cho dự án `medusa-learn`.
- Tiến hành đồng bộ mã nguồn gốc (core codebase) của Medusa phục vụ mục đích đối chiếu và phân tích.
