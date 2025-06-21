function authService(dependencies) {
  async function register({ username, password }) {
    if (!username || !password) {
      return { status: 400, body: { message: 'Username and password are required.' } };
    }
    const existingUser = await dependencies.repository.findOne({ username });
    if (existingUser) {
      return { status: 409, body: { message: 'Username already exists.' } };
    }
    const hashedPassword = await dependencies.encrypter.hash(password, 10);
    const user = new dependencies.repository({ username, password: hashedPassword });
    await user.save();
    return { status: 201, body: { message: 'User registered successfully.' } };
  }

  async function login({ username, password }) {
    const user = await dependencies.repository.findOne({ username }).select('username password role');
    if (!user) {
      return {
        status: 401,
        body: {
          message: 'Invalid credentials.'
        }
      };
    }
    const isMatch = await dependencies.encrypter.compare(password, user.password);
    if (!isMatch) {
      return {
        status: 401,
        body: {
          message: 'Invalid credentials.'
        }
      };
    }
    const token = dependencies.jwtLib.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return {
      status: 200,
      body: { token }
    };
  }

  async function passwordResetToken({ username }) {
    const user = await dependencies.repository.findOne({ username });
    if (!user) {
      return { status: 200, body: { message: 'If the user exists, a reset link will be sent.' } };
    }
    const token = dependencies.cryptoLib.randomBytes(32).toString('hex');
    const expiresIn = Date.now() + 3600000;
    user.token = token;
    user.expiresIn = expiresIn;
    await user.save();
    // TODO: Send resetToken via email to user
    return { status: 200, body: { message: 'Password reset token generated.', token } };
  }

  async function passwordReset({ token, password }) {
    const user = await dependencies.repository.findOne({
      token,
      expiresIn: { $gt: Date.now() }
    });
    if (!user) {
      return { status: 400, body: { message: 'Invalid or expired token.' } };
    }
    user.password = await dependencies.encrypter.hash(password, 10);
    user.token = undefined;
    user.expiresIn = undefined;
    await user.save();
    return { status: 200, body: { message: 'Password has been reset successfully.' } };
  }

  return {
    register,
    login,
    passwordResetToken,
    passwordReset
  };
}

export default authService;
