const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Chào Đức! Ứng dụng Node.js của bạn đang chạy trong Docker!');
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});