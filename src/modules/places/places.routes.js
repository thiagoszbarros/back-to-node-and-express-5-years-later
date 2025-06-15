import express from 'express';
import Place from './places.schema.js';
import placesService from './places.service.js';
import '../mongodb/mongodb.service.js';
import { auth } from '../../middlewares/auth.midleware.js';

const places = express();

const service = placesService({
    repository: Place
});

places.get('/', auth, service.index);

places.get('/:id', auth, service.show);

places.post('/', auth, service.store);

places.put('/:id', auth, service.update);

places.delete('/:id', auth, service.destroy);

export default places;