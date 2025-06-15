import express from 'express';
import Place from '../../app/places/places.schema.js';
import placesService from '../../app/places/places.service.js';
import '../db/mongodb.service.js';
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