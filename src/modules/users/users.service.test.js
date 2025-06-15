import usersService from './users.service';
import { fn } from 'jest-mock';

const mockUserSchema = {
  find: fn(),
  findById: fn(),
  findOne: fn(),
  findByIdAndUpdate: fn().mockResolvedValue({}),
  findByIdAndDelete: fn().mockResolvedValue({}),
  save: fn(),
};

const mockBcrypt = {
  hash: fn(),
};

const mockRes = () => {
  const res = {};
  res.status = fn().mockReturnValue(res);
  res.json = fn().mockReturnValue(res);
  res.send = fn().mockReturnValue(res);
  return res;
};

describe('usersService', () => {
  let service;
  let req;
  let res;

  beforeEach(() => {
    mockUserSchema.find.mockClear();
    mockUserSchema.findById.mockClear();
    mockUserSchema.findOne.mockClear();
    mockUserSchema.findByIdAndUpdate.mockClear();
    mockUserSchema.findByIdAndDelete.mockClear();
    mockUserSchema.save.mockClear();
    mockBcrypt.hash.mockClear();
    service = usersService({ repository: mockUserSchema, encrypter: mockBcrypt });
    req = { body: {}, params: {} };
    res = mockRes();
  });

  describe('index', () => {
    it('should return all users without passwords', async () => {
      const users = [{ username: 'user1' }, { username: 'user2' }];
      mockUserSchema.find.mockResolvedValue(users);
      await service.index(req, res);
      expect(mockUserSchema.find).toHaveBeenCalledWith({}, '-password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe('show', () => {
    it('should return a user if found', async () => {
      const user = { username: 'user1' };
      req.params.id = '123';
      mockUserSchema.findById.mockResolvedValue(user);
      await service.show(req, res);
      expect(mockUserSchema.findById).toHaveBeenCalledWith('123', '-password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });
    it('should return 404 if user not found', async () => {
      req.params.id = '123';
      mockUserSchema.findById.mockResolvedValue(null);
      await service.show(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(null);
    });
  });

  describe('store', () => {
    it('should create a new user if username does not exist', async () => {
      req.body = { username: 'newuser', password: 'pass', role: 'user' };
      mockBcrypt.hash.mockResolvedValue('hashedpass');
      mockUserSchema.findOne.mockResolvedValue(null);
      const saveMock = fn();
      function User(data) {
        return { ...data, save: saveMock };
      }
      User.findOne = mockUserSchema.findOne;
      User.find = mockUserSchema.find;
      User.findById = mockUserSchema.findById;
      User.findByIdAndUpdate = mockUserSchema.findByIdAndUpdate;
      User.findByIdAndDelete = mockUserSchema.findByIdAndDelete;
      service = usersService({ repository: User, encrypter: mockBcrypt });
      await service.store(req, res);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully.' });
    });
    it('should return 409 if username exists', async () => {
      req.body = { username: 'existing', password: 'pass', role: 'user' };
      mockUserSchema.findOne.mockResolvedValue({ username: 'existing' });
      service = usersService({ repository: mockUserSchema, encrypter: mockBcrypt });
      await service.store(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'Username already exists.' });
    });
  });

  describe('update', () => {
    it('should update user fields and return 204', async () => {
      req.body = { username: 'updated', role: 'admin' };
      req.params.id = '123';
      await service.update(req, res);
      expect(mockUserSchema.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { username: 'updated', role: 'admin' },
        { new: true, runValidators: true, select: '-password' }
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should delete user and return 204', async () => {
      req.params.id = '123';
      await service.destroy(req, res);
      expect(mockUserSchema.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
