import express from 'express';
import places from './places.routes.js';
import auth from './auth.routes.js';
import users from './users.routes.js';
import docsController from '../controllers/docs.controller.js';

const api = express();
const docs = docsController();

api.get('/', (_req, res) => {
    res.send();
});

api.get('/docs', docs.index);

api.use('', auth);
api.use('/users', users);
api.use('/places', places);

export default api;