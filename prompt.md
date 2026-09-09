# Prompt (Bản Tiếng Anh - Khuyên dùng cho Bloom để đạt độ chính xác kỹ thuật cao nhất)

"I am working on Medusa v2 and my primary task is to master the **Customer Module**. I need to understand its core architecture, data models, and default behaviors before integrating it with other modules.

Could you help me deeply analyze the Customer Module by answering the following:

1. **Core Data & Schema:** What are the default data models provided by the Customer Module? (Please detail `Customer`, `CustomerAddress`, `CustomerGroup`, and their relationships).
2. **The `has_account` Logic:** Please explain the difference between a Guest customer (`has_account = false`) and a Registered customer (`has_account = true`). How does Medusa handle it if a Guest and a Registered customer share the exact same email?
3. **Core Workflows & APIs:** What are the essential default workflows provided by `@medusajs/medusa/core-flows` for managing customers? How are they typically used via Store APIs?
4. **Data Integrity & Extension:** If a guest customer makes a purchase, and later registers an account with the same email, how does the system merge or handle these records? Furthermore, if I need to store custom fields like `avatar_url` or `date_of_birth`, what is the best practice: using `metadata` or extending the data model?
5. **Learning Path:** Based on this goal, starting from https://docs.medusajs.com/resources/commerce-modules/customer, what is the most optimal sequence of documentation pages I should read (what to read first, what to skip) to save time and stay focused? Please provide a detailed technical response for Medusa v2.

Please focus your explanation strictly on the architecture and mechanics of the Customer Module itself."

---

# Prompt (Bản Tiếng Việt)

"Tôi đang làm việc với Medusa v2 và nhiệm vụ chính của tôi là phải nắm thật vững **Customer Module**. Tôi cần hiểu rõ kiến trúc lõi, các model dữ liệu và hành vi mặc định của nó trước khi tích hợp với bất kỳ module nào khác.

Hãy giúp tôi phân tích chuyên sâu về Customer Module bằng cách trả lời các câu hỏi sau:

1. **Dữ liệu & Lược đồ cốt lõi (Schema):** Các data models mặc định của Customer Module bao gồm những gì? (Vui lòng giải thích chi tiết `Customer`, `CustomerAddress`, `CustomerGroup` và mối quan hệ giữa chúng).
2. **Logic của cờ `has_account`:** Sự khác biệt giữa khách mua vãng lai (`has_account = false`) và khách đã đăng ký (`has_account = true`) là gì? Medusa xử lý như thế nào nếu một khách vãng lai và một khách đã đăng ký có chung chính xác một địa chỉ email?
3. **Workflows & APIs cốt lõi:** Các workflows mặc định quan trọng nhất mà `@medusajs/medusa/core-flows` cung cấp để quản lý khách hàng là gì? Chúng thường được gọi thông qua Store APIs như thế nào?
4. **Toàn vẹn Dữ liệu & Mở rộng (Extend):** Nếu một khách vãng lai mua hàng (guest checkout), và sau đó chính người này đăng ký tài khoản với cùng email đó, hệ thống sẽ gộp (merge) hay xử lý 2 bản ghi này ra sao? Thêm nữa, nếu tôi muốn lưu trữ các trường tùy chỉnh như `avatar_url` hay `date_of_birth`, thì best practice (cách làm chuẩn nhất) là gì: dùng trường `metadata` có sẵn hay mở rộng (extend) data model?
5. **Lộ trình đọc Tài liệu:** Dựa trên mục tiêu trên, bắt đầu từ link https://docs.medusajs.com/resources/commerce-modules/customer, hãy vạch ra cho tôi lộ trình đọc các trang tài liệu (đọc phần nào trước, bỏ qua phần nào) để tối ưu hóa thời gian và đi đúng trọng tâm nhất. Vui lòng trả lời chi tiết về mặt kỹ thuật kiến trúc Medusa v2.

Vui lòng chỉ tập trung giải thích chặt chẽ về kiến trúc và cơ chế hoạt động của riêng Customer Module."
