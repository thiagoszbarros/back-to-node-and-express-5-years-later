import express from 'express';
import './places.schema.js';
import { index, show, store, update, destroy } from './places.service.js';
import '../mongodb/mongodb.service.js';

const places = express();

places.get('/', index);

places.get('/:id', show);

places.post('/', store);

places.put('/:id', update);

places.delete('/:id', destroy);

export default places;