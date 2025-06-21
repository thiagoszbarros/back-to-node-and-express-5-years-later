import placesService from '../../app/places/places.service.js';

function placesController(dependencies) {
  const service = placesService(dependencies);

  const index = async (_req, res) => {
    try {
      const places = await service.index();
      res.status(200).json(places);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const show = async (req, res) => {
    try {
      const place = await service.show(req.params.id);
      if (!place) {
        return res.status(404).json({ message: 'Place not found' })
      };
      res.status(200).json(place);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const store = async (req, res) => {
    try {
      const { name, address } = req.body;
      const result = await service.store({ name, address });
      res.status(result.status).json(result.body);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const update = async (req, res) => {
    try {
      const result = await service.update(req.params.id, req.body);
      res.status(result.status).json(result.body);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const destroy = async (req, res) => {
    try {
      const result = await service.destroy(req.params.id);
      res.status(result.status).json(result.body);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  return {
    index,
    show,
    store,
    update,
    destroy
  };
}

export default placesController;
