import authService from '../../app/auth/auth.service.js';

function authController(dependencies) {
  const service = authService(dependencies);

  const register = async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await service.register({ username, password });
      res.status(result.status).json(result.body);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await service.login({ username, password });
      res.status(result.status).json(result.body);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const passwordResetToken = async (req, res) => {
    try {
      const { username } = req.body;
      const result = await service.passwordResetToken({ username });
      res.status(result.status).json(result.body);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const passwordReset = async (req, res) => {
    try {
      const { token, password } = req.body;
      const result = await service.passwordReset({ token, password });
      res.status(result.status).json(result.body);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  return {
    register,
    login,
    passwordResetToken,
    passwordReset
  };
}

export default authController;
