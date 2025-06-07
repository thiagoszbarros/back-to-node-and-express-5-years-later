import express from 'express';
import './places.schema.js';
import { index, show, store, update, destroy } from './places.service.js';
import '../mongodb/mongodb.service.js';
import { auth } from '../../middlewares/auth.midleware.js';

const places = express();

places.get('/', auth, index);

places.get('/:id', auth, show);

places.post('/', auth, store);

places.put('/:id', auth, update);

places.delete('/:id', auth, destroy);

export default places;