# Active Context

## Current Focus
Bat dau trien khai thuc hanh **Task 2: Admin Request Validation Middleware** (`additionalDataValidator` voi Zod tren `POST /admin/customers`) tai `my-medusa-store/apps/backend/src/api/middlewares.ts` theo hinh thuc 1-1 pair programming.

## Recent Changes
- Hoan thanh tron ven **Task 1: Customer Welcome Subscriber**:
  - Trien khai tai `src/subscribers/customer-created.ts` voi co che idempotency key `welcome-customer:{customer_id}:email`.
  - Pass 4/4 unit tests tai `src/subscribers/__tests__/customer-created.unit.spec.ts`.
  - Kiem chung live tren database PostgreSQL `notification` table khi tao khach hang qua Medusa Admin.
  - Commit ma nguon `a67515f` tren branch `main`.
- Chuan hoa toan dien quy trinh va workflow **`/daily-report`**:
  - Cai to file `.agents/workflows/daily-report.md` theo triet ly "Understated Rigor": khong dung danh xung tu phong, cat bo buzzwords, loai bo micro-benchmark dev vo nghia, tuan thu chat che Zero-Emoji Policy.
  - Thiet lap co che Local-First Ground Truth: doc `git log` va `memory-bank/activeContext.md` truoc khi fetch LarkSuite.
  - Dong bo va cap nhat thanh cong 100% (21/21 tasks) tren LarkSuite Base tu ngay 07/09/2026 den 14/09/2026, bao dam su dong nhat, khiem ton va dung chuan muc ky thuat.
- Chuan hoa toan dien tai lieu kien truc **`LEARNING_PLAN.md`** doi chieu source code Medusa v2.20.1:
  - Xac dinh ro API boundary: `POST /admin/customers` ho tro `additional_data` qua `WithAdditionalData`, con `POST /store/customers` chi nhan fields chuan va `metadata`.
  - Chuan hoa mo hinh Auth Module: `auth_identity` va cac `provider_identity` (`auth_identity.provider_identities`); nhieu `AuthIdentity` co the cung tro toi mot `Customer` thong qua `app_metadata.customer_id`.
  - Phat hien gioi han DTO: `has_account` co trong `CreateCustomerDTO` nhung khong co trong `UpdateCustomerDTO` va `CustomerUpdatableFields`. Public service `customerModuleService.updateCustomers` khong ho tro sua `has_account`.
  - Dinh vi kien truc Account Reconciliation chuan: Tao Registered Customer qua `createCustomerAccountWorkflow`, chuyen don qua `requestOrderTransferWorkflow` -> `acceptOrderTransferWorkflow`; coi In-place Upgrade la Research Spike ngoai public contract.
  - Thiet ke luong Saga 4 buoc an toan: (1) Validate -> (2) DB unique claim -> (3) Atomic increment -> (4) Failure injection de rollback.
  - Chuan hoa luong JWT refresh qua `POST /auth/token/refresh` sau khi lien ket identity.
  - Thiet lap bang Evidence of Completion lam verification gate cho 3 cum task.
- Hoan tat cap nhat va lam sach 100% icon/emoji tren ca hai trang Notion (Playbook Customer Welcome Subscriber va Root Onboarding Guide) cung nhu bao cao hang ngay LarkSuite Base.

## Active Decisions
- Tuyet doi tuan thu quy tac khong dung emoji/icon trong code, tai lieu ky thuat, commit messages, Notion va LarkSuite Base.
- Ap dung triet ly "Understated Rigor" cho tat ca cac bao cao ky thuat: dung dung ban chat ky thuat, de ket qua tu chung minh, khong dung danh xung tu phong (Staff/Senior/Enterprise) va khong trich dan so lieu benchmark dev vo nghia.
- Huong toi kien truc chuan san xuat (production-ready): Dung workflow chinh thuc (`createCustomerAccountWorkflow`, `requestOrderTransferWorkflow`, `acceptOrderTransferWorkflow`) thay vi can thiep truc tiep vao database hoac entity internal de sua `has_account`.
- Bao ve idempotency xuyen suot bang rang buoc duy nhat tren database (`UNIQUE constraint`), khong chi dua vao in-memory hoac workflow execution engine.
- Tuan thu Antigravity CLI Delegation Rule: IDE khong tu dong chay cac lenh commit, push, build, test; cung cap CLI task blocks day du de user thuc thi qua terminal ngoai.

## Next Steps
1. Pair-programming Task 2: Dinh nghia middleware validation cho `POST /admin/customers` voi `additionalDataValidator` va Zod schema (`zalo_id`, `avatar_url`) tai `src/api/middlewares.ts`.
2. Kiem thu middleware validation bang HTTP requests (kiem tra truong hop input sai bi 400 va input dung duoc pass).
3. Tiep tuc sang Task 3: Workflow Hook `customersCreated` de luu `additional_data` vao `metadata`.

## Known Issues / Blockers
- Khong co. Base project va DB san sang cho Task 2.
