import { Roles } from '../../../app/users/roles.js';

export function updateUserRequest(req, res, next) {
  const { role } = req.body;
  if (role && ![Roles.ADMIN, Roles.USER].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }
  next();
}
