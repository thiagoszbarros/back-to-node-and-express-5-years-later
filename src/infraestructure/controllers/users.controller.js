import usersService from '../../app/users/users.service.js';

function usersController(dependencies) {
  const service = usersService(dependencies);

  const index = async (_req, res) => {
    try {
      const users = await service.index();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const show = async (req, res) => {
    try {
      const user = await service.show(req.params.id);
      if (!user) return res.status(404).json(user);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const store = async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const result = await service.store({ username, password, role });
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

export default usersController;
