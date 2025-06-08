export function passwordResetTokenRequest(req, res, next) {
  if (req.body?.username === undefined) {
    return res.status(400).json({ message: 'Username is required.' });
  }
  const { username } = req.body;
  if (!username || typeof username !== 'string' || username.trim() === '') {
    return res.status(400).json({ message: 'Username is required.' });
  }
  next();
}
