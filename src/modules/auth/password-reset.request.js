export function passwordResetRequest(req, res, next) {
  if (req.body?.token === undefined) {
    return res.status(400).json({ message: 'Token is required.' });
  }
  if (req.body?.newPassword === undefined) {
    return res.status(400).json({ message: 'New password is required.' });
  }
  const { token, newPassword } = req.body;
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return res.status(400).json({ message: 'Token is required.' });
  }
  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim() === '') {
    return res.status(400).json({ message: 'New password is required.' });
  }
  next();
}
