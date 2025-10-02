const jwt = require('jsonwebtoken');

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu
    if (!email || !password) {
      return res.status(400).json({ msg: "Thiếu email hoặc mật khẩu" });
    }

    // Tìm user
    const user = await db.Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "Tài khoản không tồn tại" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Sai mật khẩu" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      msg: "Đăng nhập thành công",
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: "Lỗi server", error: err.message });
  }
});
