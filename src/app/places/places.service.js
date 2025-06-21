function placesService(dependencies) {
  async function index() {
    const places = await dependencies.repository.find();
    return places;
  }

  async function show(id) {
    const place = await dependencies.repository.findById(id);
    return place;
  }

  async function store({ name, address }) {
    const place = new dependencies.repository({ name, address });
    await place.save();
    return { status: 201, body: place };
  }

  async function update(id, data) {
    await dependencies.repository.findByIdAndUpdate(
      id,
      { name: data.name, address: data.address },
      { new: true, runValidators: true }
    );
    return { status: 204, body: null };
  }

  async function destroy(id) {
    await dependencies.repository.findByIdAndDelete(id);
    return { status: 204, body: null };
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