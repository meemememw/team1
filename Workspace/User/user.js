const express = require('express');
const router = express.Router();

// 임시 데이터 저장소 (실제 앱에서는 데이터베이스 사용)
const users = {};

// 회원 가입 API (POST /user/signup)
router.post('/signup', (req, res) => {
  const { id, password, name, email } = req.body;

  if (!id || !password || !name || !email) {
    return res.status(400).json({ message: '모든 정보를 입력해주세요.' });
  }

  if (users[id]) {
    return res.status(409).json({ message: '이미 사용 중인 아이디입니다.' });
  }

  users[id] = { password, name, email };
  res.status(201).json({ message: `${name}님, 가입을 환영합니다!`, userId: id });
});

// 회원 목록 조회 API (GET /user/list)
router.get('/list', (req, res) => {
  const memberList = Object.keys(users).map(id => ({ id, name: users[id].name }));
  res.json(memberList);
});

// 특정 회원 정보 조회 API (GET /user/:id)
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  const user = users[userId];

  if (!user) {
    return res.status(404).json({ message: '해당 회원을 찾을 수 없습니다.' });
  }

  res.json({ id: userId, name: user.name, email: user.email });
});

// 회원 정보 수정 API (PUT /user/:id)
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const { password, name, email } = req.body;
  const user = users[userId];

  if (!user) {
    return res.status(404).json({ message: '해당 회원을 찾을 수 없습니다.' });
  }

  if (password) user.password = password;
  if (name) user.name = name;
  if (email) user.email = email;

  res.json({ message: `${user.name}님의 정보가 수정되었습니다.`, userId });
});

// 회원 탈퇴 API (DELETE /user/:id)
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  if (!users[userId]) {
    return res.status(404).json({ message: '해당 회원을 찾을 수 없습니다.' });
  }

  delete users[userId];
  res.json({ message: `${userId} 계정이 삭제되었습니다.` });
});

module.exports = router;  ///user/signup (POST): 회원 가입
// /user/list (GET): 회원 목록 조회
// /user/:id (GET): 특정 회원 정보 조회
// /user/:id (PUT): 특정 회원 정보 수정
// /user/:id (DELETE): 특정 회원 탈퇴