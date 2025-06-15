import { Roles } from '../modules/users/roles.js';

export function admin(req, res, next) {
    if (req.user && req.user.role === Roles.ADMIN) {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required.' });
}
