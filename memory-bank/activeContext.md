# Active Context

## Current Focus
Soạn thảo tài liệu chuẩn & tinh gọn về **Medusa Customer Module** để đẩy lên Notion cho team SmartOSC.

## Recent Changes
- Hoàn thành nghiên cứu & audit chuyên sâu Customer Module (5 bảng DB thực tế, UNIQUE index compound `(email, has_account)`, Soft Delete, Impact với Auth/Cart/Order/Promotion, Store/Admin API endpoints).
- Đã hoàn thiện và thống nhất **Plan v2**:
  - Lưu tại artifact: `implementation_plan.md`
  - Lưu tại project note: `notes/customer-module-notion-plan.md`
- Đã kiểm tra trạng thái Notion MCP (gặp lỗi 401 do trang Notion chưa được share cho Integration).

## Active Decisions
- Giữ cấu trúc 5 Phase logic: Bản chất -> `has_account` & Uniqueness -> Impact -> API có sẵn -> Hướng mở rộng (Extend).
- Nội dung tập trung vào cốt lõi thực tế, không sao chép nguyên xi Medusa Docs.

## Next Steps (Ngày mai bắt đầu)
1. User kết nối Notion Integration vào trang "Medusa Customer Module" (Menu `...` -> **Connect to** -> Chọn Integration).
2. AI gọi Notion MCP để lấy Page ID và cập nhật nội dung markdown đầy đủ lên Notion (`API-update-page-markdown`).
3. Review kết quả trực tiếp trên Notion và tinh chỉnh formatting.

## Known Issues / Blockers
- Notion MCP trả về 401 do quyền truy cập trang Notion chưa được cấp cho Integration token.
