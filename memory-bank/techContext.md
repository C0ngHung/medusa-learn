# Tech Context

## Technologies
- **Core Framework:** Medusa v2 (@medusajs/medusa)
- **Runtime:** Node.js (v20+), TypeScript
- **Database:** PostgreSQL (v15+)
- **Cache / PubSub:** Redis (v7+)
- **Storefront:** Next.js (React), Tailwind CSS
- **Package Manager:** pnpm (v9)

## Development Setup
- Môi trường: Windows (có cài đặt WSL/Git Bash).
- Lệnh chạy chính: `pnpm run dev` (khởi chạy cả backend và storefront).
- Lệnh DB: `cd my-medusa-store/apps/backend` && `npx medusa db:migrate`.

## Constraints & Gotchas
- **pnpm v9 strictness:** Lỗi `[ERR_PNPM_IGNORED_BUILDS]` trong Medusa v2 cần được giải quyết bằng `pnpm approve-builds` trước khi install.
- **Publishable Key:** Storefront bắt buộc phải có `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` hợp lệ lấy từ Admin Dashboard để tránh lỗi crash hoặc 401 Unauthorized.
- **Guard System:** Mọi tác vụ AI thay đổi file hệ thống phải tuân thủ luật cấm ghi tại `.agents/protected-paths.txt`.
