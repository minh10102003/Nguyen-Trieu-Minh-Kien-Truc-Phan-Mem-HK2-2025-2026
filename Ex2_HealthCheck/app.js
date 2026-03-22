const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Kết nối tới MongoDB (Sử dụng tên service 'mongodb' trong Docker Compose)
const mongoURI = 'mongodb://mongodb:27017/my_database';

mongoose.connect(mongoURI)
  .then(() => console.log('Đã kết nối thành công tới MongoDB!'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Chào Đức! App Node.js đã kết nối với MongoDB thành công!');
});

app.listen(3000, () => console.log('Server chạy tại cổng 3000'));