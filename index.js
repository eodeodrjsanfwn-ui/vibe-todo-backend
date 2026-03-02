const path = require('path');
const envPath = path.join(__dirname, '.env');
const dotenvResult = require('dotenv').config({ path: envPath });

if (dotenvResult.error) {
  console.warn('[env] .env 파일을 찾을 수 없습니다:', envPath);
} else if (process.env.MONGODB_URI) {
  const isAtlas = process.env.MONGODB_URI.includes('mongodb+srv');
  console.log('[env] MONGODB_URI 로드됨 (' + (isAtlas ? 'Atlas' : '로컬') + ')');
} else {
  console.warn('[env] .env에 MONGODB_URI가 없습니다.');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todosRouter = require('./routers/todos');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-backend';

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('연결 성공');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err.message);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.json({ message: 'Todo Backend API', status: 'ok' });
});

app.use('/api/todos', todosRouter);
