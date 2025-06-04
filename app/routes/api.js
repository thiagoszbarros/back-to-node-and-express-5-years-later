import express from 'express';
import places from '../modules/places/places.routes.js';

const api = express();

api.get('/', (req, res) => {
    console.log(req.query);
    res.send('api base route');
});

api.use('/places', places);

export default api;