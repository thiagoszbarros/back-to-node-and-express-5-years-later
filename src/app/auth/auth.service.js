function authService(dependencies = {}) {
  async function register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const existingUser = await dependencies.repository.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    const hashedPassword = await dependencies.encrypter.hash(password, 10);
    const user = new dependencies.repository({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  }

  async function login(req, res) {
    const { username, password } = req.body;
    const user = await dependencies.repository.findOne({ username }).select('username password role');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await dependencies.encrypter.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = dependencies.jwtLib.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  }

  async function passwordResetToken(req, res) {
    const user = await dependencies.repository.findOne({ username: req.body.username });
    if (!user) {
      return res.status(200).json({ message: 'If the user exists, a reset link will be sent.' });
    }
    const token = dependencies.cryptoLib.randomBytes(32).toString('hex');
    const expiresIn = Date.now() + 3600000;
    user.token = token;
    user.expiresIn = expiresIn;
    await user.save();
    // TODO: Send resetToken via email to user
    res.json({ message: 'Password reset token generated.', token });
  }

  async function passwordReset(req, res) {
    const user = await dependencies.repository.findOne({
      token: req.body.token,
      expiresIn: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }
    user.password = await dependencies.encrypter.hash(req.body.newPassword, 10);
    user.token = undefined;
    user.expiresIn = undefined;
    await user.save();
    res.json({ message: 'Password has been reset successfully.' });
  }

  return {
    register,
    login,
    passwordResetToken,
    passwordReset
  };
}

export default authService;
