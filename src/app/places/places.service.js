function placesService(dependencies) {
  async function index(_req, res) {
    const places = await dependencies.repository.find();
    res.status(200).json(places);
  }

  async function show(req, res) {
    const place = await dependencies.repository.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.status(200).json(place);
  }

  async function store(req, res) {
    const { name, address } = req.body;
    const place = new dependencies.repository({ name, address });
    await place.save();
    res.status(201).json(place);
  }

  async function update(req, res) {
    await dependencies.repository.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, address: req.body.address },
      { new: true, runValidators: true }
    );
    res.status(204).send();
  }

  async function destroy(req, res) {
    await dependencies.repository.findByIdAndDelete(req.params.id);
    res.status(204).send();
  }

  return {
    index,
    show,
    store,
    update,
    destroy
  };
}

export default placesService;