const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('./db'); // kết nối DB

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    // Kiểm tra dữ liệu
    if (!email || !password) {
      return res.status(400).json({ msg: "Thiếu email hoặc mật khẩu" });
    }

    // Kiểm tra email tồn tại
    const userExists = await db.Users.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ msg: "Email đã tồn tại" });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu DB
    await db.Users.create({
      email,
      password: hashedPassword,
      fullname,
      role: "student"
    });

    res.status(201).json({ msg: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
});
