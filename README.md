# Nguyen Trieu Minh – Kiến trúc phần mềm (HK2 2025-2026) – Week 3

**MSSV:** 21103201  
**Email:** nguyentrieuminh1003@gmail.com  
**Chuyên ngành:** Kỹ thuật phần mềm

Repository này chứa **nội dung Week 3** môn Thiết kế kiến trúc phần mềm.

## Nội dung Week 3

| Thư mục | Mô tả |
|---------|--------|
| **Design Pattern** | Observer (Stock, Task) & Adapter (XML → JSON) – Java |
| **Domain vs Technical** | So sánh kiến trúc Domain-Driven vs Technical-Driven (Node/JS) |
| **LoadBalancer** | Nginx + 2 server Node (round-robin) |
| **Performance** | Demo Redis cache với API đọc/ghi file |
| **MQ** | Minh chứng Sync vs Async (Message Queue) |
| **Scalability** | Tài liệu/minh chứng Scalability |
| **Security** | Tài liệu/minh chứng Security |

## Cách chạy

- **Design Pattern:** Mở project Java trong IDE, chạy `src/Main.java`.
- **LoadBalancer:** `cd Week3/LoadBalancer` → `docker-compose up --build` → test http://localhost:4000.
- **Performance:** `cd Week3/Performance` → `docker-compose up -d` → `npm install` → `npm start` → GET/POST http://localhost:3000/api/data.

Chi tiết xem README trong từng thư mục con.
