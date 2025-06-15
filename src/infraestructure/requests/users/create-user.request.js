import { Roles } from '../../../domain/users/roles.js';

export function createUserRequest(req, res, next) {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' });
  }
  if (![Roles.ADMIN, Roles.USER].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }
  next();
}
