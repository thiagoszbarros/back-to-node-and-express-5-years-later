import User from './users.schema.js';
import bcrypt from 'bcrypt';

export async function index(_req, res) {
  const users = await User.find({}, '-password');
  res.status(200).json(users);
}

export async function show(req, res) {
  const user = await User
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

export async function store(req, res) {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists.' });
  }
  const user = new User({ username, password: hashedPassword, role });
  await user.save();
  res.status(201).json({ message: 'User created successfully.' });
}

export async function update(req, res) {
  const updateFields = {};
  if (req.body.username) {
    updateFields.username = req.body.username
  };
  if (req.body.role) {
    updateFields.role = req.body.role
  };
  User.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true, select: '-password' }
  );
  res.status(204).send();
}

export async function destroy(req, res) {
  User.findByIdAndDelete(req.params.id);
  res.status(204).send();
}
