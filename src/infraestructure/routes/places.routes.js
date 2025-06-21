import express from 'express';
import placesController from '../controllers/places.controller.js';
import Place from '../schemas/places.schema.js';
import { auth } from '../middlewares/auth.midleware.js';

const places = express();

const controller = placesController({
  repository: Place
});

places.get('/', auth, controller.index);
places.get('/:id', auth, controller.show);
places.post('/', auth, controller.store);
places.put('/:id', auth, controller.update);
places.delete('/:id', auth, controller.destroy);

export default places;