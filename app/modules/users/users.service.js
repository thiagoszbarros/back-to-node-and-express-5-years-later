function usersService(dependencies = {}) {
  async function index(_req, res) {
    const users = await dependencies
      .repository
      .find({}, '-password');

    res.status(200).json(users);
  }

  async function show(req, res) {
    const user = await dependencies
    .repository
      .findById(req
        .params
        .id, '-password'
      );
    if (!user) {
      return res
        .status(404)
        .json(user);
    }
    res
      .status(200)
      .json(user);
  }

  async function store(req, res) {
    const { username, password, role } = req.body;
    const hashedPassword = await dependencies
      .encrypter
      .hash(password, 10);
    const existingUser = await dependencies
      .repository
      .findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    const user = new dependencies.repository({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully.' });
  }

  async function update(req, res) {
    const updateFields = {};
    if (req.body.username) {
      updateFields.username = req.body.username
    };
    if (req.body.role) {
      updateFields.role = req.body.role
    };
    dependencies
      .repository
      .findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true, runValidators: true, select: '-password' }
      );
    res.status(204).send();
  }

  async function destroy(req, res) {
    dependencies
      .repository
      .findByIdAndDelete(req.params.id);

    res.status(204).send();
  }

  return {
    index,
    show,
    store,
    update,
    destroy
  }
}

export default usersService;