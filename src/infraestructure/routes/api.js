import express from 'express';
import places from './places.routes.js';
import auth from './auth.routes.js';
import users from './users.routes.js';

const api = express();

api.get('/', (_req, res) => {
    res.json({ message: 'Api base route' });
});

api.use('/places', places);
api.use('/users', users);
api.use('', auth);

export default api;