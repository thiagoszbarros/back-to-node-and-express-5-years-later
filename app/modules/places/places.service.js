import mongoose from 'mongoose';

import { handleServerInternalError } from '../shared/handle-server-internal-error.service.js';

export async function index(_, res) {
    try {
        const Place = mongoose.model('Place');

        const places = await Place.find();

        res
            .status(200)
            .json(places);
    } catch (error) {
        handleServerInternalError(res, error);
    }
}

export async function show(req, res) {
    try {
        const Place = mongoose.model('Place');

        const place = await Place.findById(req.params.id);

        if (!place) {
            return res.status(404).send('Place not found');
        }

        res
            .status(200)
            .json(place);
    } catch (error) {
        handleServerInternalError(res, error);
    }
}

export async function store(req, res) {
    try {
        const Place = mongoose.model('Place');

        const newPlace = new Place({
            name: req.body.name,
            address: req.body.address,
        });

        await newPlace.save();

        res
            .status(201)
            .json(newPlace);
    } catch (error) {
        handleServerInternalError(res, error);
    }
}

export async function update(req, res) {
    try {
        const Place = mongoose.model('Place');

        const updatedPlace = await Place.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, address: req.body.address },
            { new: true }
        );

        if (!updatedPlace) {
            return res.status(404).send('Place not found');
        }

        res
            .status(200)
            .json(updatedPlace);
    } catch (error) {
        handleServerInternalError(res, error);
    }
}

export async function destroy(req, res) {
    try {
        const Place = mongoose.model('Place');

        const deletedPlace = await Place.findByIdAndDelete(req.params.id);

        if (!deletedPlace) {
            return res
                .status(404)
                .send('Place not found');
        }

        res.status(200).json({ message: 'Place deleted successfully' });
    } catch (error) {
        handleServerInternalError(res, error);
    }
}