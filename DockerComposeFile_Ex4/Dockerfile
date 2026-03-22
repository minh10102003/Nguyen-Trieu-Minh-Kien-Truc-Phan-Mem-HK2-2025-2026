# 1. Sử dụng môi trường Node.js có sẵn
FROM node:18-alpine

# 2. Tạo thư mục làm việc bên trong container
WORKDIR /app

# 3. Chép file package.json vào và cài đặt thư viện
COPY package.json .
RUN npm install

# 4. Chép toàn bộ mã nguồn vào container
COPY . .

# 5. Mở cổng 3000
EXPOSE 3000

# 6. Lệnh để chạy ứng dụng
CMD ["node", "app.js"]