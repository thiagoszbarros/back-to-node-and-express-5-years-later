function usersService(dependencies) {
  async function index() {
    const users = await dependencies.repository.find({}, '-password');
    return users;
  }

  async function show(id) {
    const user = await dependencies.repository.findById(id, '-password');
    return user;
  }

  async function store({ username, password, role }) {
    const hashedPassword = await dependencies.encrypter.hash(password, 10);
    const existingUser = await dependencies.repository.findOne({ username });
    if (existingUser) {
      return { status: 409, body: { message: 'Username already exists.' } };
    }
    const user = new dependencies.repository({ username, password: hashedPassword, role });
    await user.save();
    return { status: 201, body: { message: 'User created successfully.' } };
  }

  async function update(id, data) {
    const updateFields = {};
    if (data.username) updateFields.username = data.username;
    if (data.role) updateFields.role = data.role;
    await dependencies.repository.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true, select: '-password' }
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

export default usersService;