# Product Context

## Problem to Solve
- Các dự án thương mại điện tử tại SmartOSC yêu cầu tính năng Social Login phức tạp (đăng nhập bằng Google, Zalo, TikTok), bao gồm cả việc hợp nhất giỏ hàng, liên kết tài khoản mạng xã hội với tài khoản khách hàng hiện có. Cấu trúc mới của Medusa v2 chia tách hoàn toàn Auth Module và Customer Module, đòi hỏi một sự hiểu biết sâu sắc về Module Links và Data Flow để tùy biến an toàn.
- Tài liệu gốc của Medusa v2 đồ sộ và phân tán, gây tốn nhiều thời gian cho các developer trong team khi tiếp cận module mới. Cần một tài liệu tinh gọn, thực chiến để chia sẻ kiến thức chéo (cross-sharing) giữa các dev.

## User Experience Goals
- Khách hàng (End-user) có thể đăng ký/đăng nhập mượt mà qua các mạng xã hội.
- Khách hàng mua ẩn danh (Guest) được bảo lưu lịch sử đơn hàng và giỏ hàng khi đăng ký tài khoản chính thức cùng email.
- Developer trong team chỉ cần ~15 phút để nắm vững 80-90% bản chất cốt lõi của Customer Module thông qua tài liệu Notion.

## How It Should Work
- Auth Module xác thực danh tính (AuthIdentity).
- Customer Module lưu trữ thông tin nghiệp vụ.
- Module Link kết nối AuthIdentity ↔ Customer (thông qua bảng `customer_account_holder`).
- Quy trình đăng nhập bên thứ 3 (OAuth2) được thực hiện, webhook hoặc callback sẽ tự động tạo/nối AuthIdentity vào Customer tương ứng dựa trên Email hoặc chiến lược Merge (ADR-001).
- Tài liệu Notion được chia thành 5 Phase logic: Bản chất -> `has_account` & Uniqueness -> Impact -> API có sẵn -> Hướng mở rộng (Extend).
