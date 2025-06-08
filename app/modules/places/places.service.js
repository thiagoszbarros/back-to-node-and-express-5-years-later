import Place from './places.schema.js';

export async function index(_req, res) {
    const places = await Place.find();
    res.status(200).json(places);
}

export async function show(req, res) {
    const place = await Place.findById(req.params.id);
    if (!place) {
        return res.status(404).json({ message: 'Place not found' });
    }
    res.status(200).json(place);
}

export async function store(req, res) {
    const newPlace = new Place({
        name: req.body.name,
        address: req.body.address,
    });
    await newPlace.save();
    res.status(201).json(newPlace);
}

export async function update(req, res) {
    Place.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name, address: req.body.address },
        { new: true }
    );

    res.status(204).send();
}

export async function destroy(req, res) {
    Place.findByIdAndDelete(req.params.id);
    res.status(204).send();
}