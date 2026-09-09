---
type: project
created: 2026-07-18
updated: 2026-07-18
---

# Technical Decisions

- Component metadata uses SemVer while the toolkit release keeps CalVer.
- `manifest.json` and `manifest.lock.json` must remain synchronized with component frontmatter.
- Tích hợp Plugin `medusa-dev` và MCP server `medusa-docs` để hỗ trợ phát triển theo đúng chuẩn kiến trúc Medusa v2.
- Biên soạn hướng dẫn `notes/ai-tools-guide.md` và liên kết trong `README.md` để chuẩn hóa workflow AI theo từng Phase học tập.
- Chuẩn hóa tài liệu Customer Module trên Notion thành 5 Phase độc lập, khai thác trực tiếp dữ liệu từ PostgreSQL (`medusa_db`) và source code `@medusajs/medusa` v2.20.1 (`notes/customer-module-notion-plan.md`).
