const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

// 할일 목록 조회
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error('GET /api/todos 오류:', err);
    res.status(500).json({ error: err.message });
  }
});

// 할일 상세 조회 (단건 보기)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });
    }
    res.json(todo);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// 할일 수정
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      id,
      { ...(title !== undefined && { title }), ...(completed !== undefined && { completed }) },
      { new: true, runValidators: true }
    );
    if (!todo) {
      return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });
    }
    res.json(todo);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// 할일 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });
    }
    res.json({ message: '할일이 삭제되었습니다.', todo });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// 할일 생성
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: '할일 내용을 입력해주세요.' });
    }
    const todo = await Todo.create({ title });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
