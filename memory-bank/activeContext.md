# Active Context

## Current Focus
Rà soát chuyên sâu tài liệu Customer Module (8 chương chuẩn Enterprise), hoàn thiện sơ đồ quan hệ thực thể Relations Overview trên Notion, chuẩn hóa phong cách tài liệu không emoji/icon và chuẩn bị kịch bản phản biện kỹ thuật cho buổi presentation nội bộ cùng team.

## Recent Changes
- Phân tích trực tiếp source code core của Medusa: `find-or-create-customer.ts` (cơ chế Guest mặc định) và `create-customer-account.ts` (ép cờ `has_account` và nối Auth Identity).
- Đã xuất bản thành công tài liệu **Medusa v2: Core Architecture & Design Patterns** lên Notion (bao gồm kiến trúc Workflow, Extension Triad, và nguyên lý không dùng async/await trong khai báo Workflow).
- Đã xuất bản thành công tài liệu **Onboarding Guide: Từ Java Master đến MedusaJS** lên Notion (4 cú quay xe tư duy: Event Loop, Destructuring, Duck Typing, First-class Functions).
- Đã hoàn tất báo cáo hàng ngày (`/daily-report`) cho ngày 10/09/2026 và 11/09/2026 lên LarkSuite Base với các task kỹ thuật chuẩn hóa.
- Đã nâng cấp toàn diện tài liệu **Medusa Customer Module — Bản chất cốt lõi** lên phiên bản v2 Enterprise Edition trên Notion: Bổ sung Data Dictionary chi tiết, sơ đồ Sequence Diagrams đăng ký 2 bước & Guest Checkout, bảng tra cứu 6 Workflow Hook Points chính thức, mô hình Saga Compensation (`StepResponse`), nguyên tắc ranh giới Reversible (Hook) vs Irreversible (Subscriber), và giải pháp 3 lớp chống Spam Address DoS (Quota Middleware).
- Tích hợp sơ đồ quan hệ thực thể **Relations Overview** chuẩn từ tài liệu Medusa Documentation dưới dạng Mermaid ER diagram (`Customer`, `CustomerAddress`, `CustomerGroup`) trực tiếp vào Mục 2.1 Chương 2 của trang Notion Customer Module.
- Rà soát và loại bỏ triệt để 100% toàn bộ emoji/icon trên cả 2 trang Notion (`Medusa Customer Module` và `Medusa v2: Core Architecture & Design Patterns`) tuân thủ nghiêm ngặt quy định phong cách làm việc của Mentor & Leader.
- Mở rộng toàn diện bộ câu hỏi kỹ thuật chuyên sâu tại `notes/question.md` từ 10 câu lên 16 câu hỏi bao quát Domain Logic vs Orchestration, 2 cơ chế can thiệp luồng Hook vs Event, 5 cấp độ customization trong Medusa v2, và cơ chế Partial Unique Index `(email, has_account)`.

## Active Decisions
- Tuyệt đối tuân thủ quy tắc không dùng emoji/icon trong tài liệu kỹ thuật, commit messages, và trang Notion theo yêu cầu khắt khe của Mentor & Leader.
- Tích hợp trực tiếp Mermaid diagram vào Notion markdown để nền tảng tự render đồ họa tương tác.
- Lưu trữ mọi lý thuyết và Mental Model dưới dạng Notion page độc lập, có link liên kết, không viết dồn vào một file để tránh loãng thông tin.
- Chuẩn bị bắt tay vào triển khai thực tế bộ 3 thành phần mở rộng: Quota Middleware, Loyalty Wallet Hook (Saga), và Welcome Subscriber.

## Next Steps
1. Thực hành code thực chiến (Hands-on) tại `my-medusa-store/apps/backend`:
   - Task 1: Tạo Middleware Quota Limit (`src/api/middlewares.ts`) chặn spam tối đa 20 địa chỉ.
   - Task 2: Tạo Workflow Hook `customersCreated` (`src/workflows/hooks/customer-created.ts`) có Saga Compensation.
   - Task 3: Tạo Event Subscriber `customer.created` (`src/subscribers/customer-created.ts`) gửi thông báo chào mừng.
2. Kiểm thử và xác nhận bằng unit / integration test và verify qua HTTP client.

## Known Issues / Blockers
- Không có. Sẵn sàng thực thi code.
