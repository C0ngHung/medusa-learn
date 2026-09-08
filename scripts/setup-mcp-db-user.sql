-- 1. Tạo user riêng cho AI
CREATE ROLE agents WITH LOGIN PASSWORD 'root123';

-- 2. Cấp quyền kết nối vào database medusa_db
GRANT CONNECT ON DATABASE medusa_db TO agents;

-- 3. Cấp quyền sử dụng schema public
GRANT USAGE ON SCHEMA public TO agents;

-- 4. Cấp quyền Read/Write (Select, Insert, Update, Delete...) trên toàn bộ bảng HIỆN CÓ
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO agents;

-- 5. Cấp quyền trên các Sequences (Rất quan trọng để các lệnh INSERT có thể tự tăng ID)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO agents;

-- 6. Đảm bảo quyền tự động được cấp cho các bảng và sequences được tạo ra trong TƯƠNG LAI
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO agents;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO agents;
