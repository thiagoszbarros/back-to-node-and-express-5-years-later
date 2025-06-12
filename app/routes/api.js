import express from 'express';
import places from '../modules/places/places.routes.js';
import auth from '../modules/auth/auth.routes.js';
import users from '../modules/users/users.routes.js';

const api = express();

api.get('/', (_req, res) => {
    res.json({ message: 'Api base route' });
});

api.use('/places', places);
api.use('/users', users);
api.use('', auth);

export default api;