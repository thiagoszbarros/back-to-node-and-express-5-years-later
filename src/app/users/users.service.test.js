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

describe('usersService', () => {
  let service;
  beforeEach(() => {
    mockUserSchema.find.mockClear();
    mockUserSchema.findById.mockClear();
    mockUserSchema.findOne.mockClear();
    mockUserSchema.findByIdAndUpdate.mockClear();
    mockUserSchema.findByIdAndDelete.mockClear();
    mockUserSchema.save.mockClear();
    mockBcrypt.hash.mockClear();
    service = usersService({ repository: mockUserSchema, encrypter: mockBcrypt });
  });

  describe('index', () => {
    it('should return all users without passwords', async () => {
      const users = [{ username: 'user1' }, { username: 'user2' }];
      mockUserSchema.find.mockResolvedValue(users);
      const result = await service.index();
      expect(mockUserSchema.find).toHaveBeenCalledWith({}, '-password');
      expect(result).toEqual(users);
    });
  });

  describe('show', () => {
    it('should return a user if found', async () => {
      const user = { username: 'user1' };
      mockUserSchema.findById.mockResolvedValue(user);
      const result = await service.show('123');
      expect(mockUserSchema.findById).toHaveBeenCalledWith('123', '-password');
      expect(result).toEqual(user);
    });
    it('should return null if user not found', async () => {
      mockUserSchema.findById.mockResolvedValue(null);
      const result = await service.show('123');
      expect(result).toBeNull();
    });
  });

  describe('store', () => {
    it('should create a new user if username does not exist', async () => {
      mockBcrypt.hash.mockResolvedValue('hashedpass');
      mockUserSchema.findOne.mockResolvedValue(null);
      const saveMock = fn();
      function User(data) {
        return { ...data, save: saveMock };
      }
      const repo = Object.assign(User, mockUserSchema);
      service = usersService({ repository: repo, encrypter: mockBcrypt });
      const result = await service.store({ username: 'newuser', password: 'pass', role: 'user' });
      expect(mockBcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(saveMock).toHaveBeenCalled();
      expect(result.status).toBe(201);
      expect(result.body).toEqual({ message: 'User created successfully.' });
    });
    it('should return 409 if username exists', async () => {
      mockUserSchema.findOne.mockResolvedValue({ username: 'existing' });
      const result = await service.store({ username: 'existing', password: 'pass', role: 'user' });
      expect(result.status).toBe(409);
      expect(result.body).toEqual({ message: 'Username already exists.' });
    });
  });

  describe('update', () => {
    it('should update user fields and return 204', async () => {
      const result = await service.update('123', { username: 'updated', role: 'admin' });
      expect(mockUserSchema.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { username: 'updated', role: 'admin' },
        { new: true, runValidators: true, select: '-password' }
      );
      expect(result.status).toBe(204);
      expect(result.body).toBeNull();
    });
    it('should update only username if only username is present', async () => {
      const result = await service.update('123', { username: 'updated' });
      expect(mockUserSchema.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { username: 'updated' },
        { new: true, runValidators: true, select: '-password' }
      );
      expect(result.status).toBe(204);
      expect(result.body).toBeNull();
    });
    it('should update only role if only role is present', async () => {
      const result = await service.update('123', { role: 'admin' });
      expect(mockUserSchema.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { role: 'admin' },
        { new: true, runValidators: true, select: '-password' }
      );
      expect(result.status).toBe(204);
      expect(result.body).toBeNull();
    });
    it('should update nothing if neither username nor role is present', async () => {
      const result = await service.update('123', {});
      expect(mockUserSchema.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        {},
        { new: true, runValidators: true, select: '-password' }
      );
      expect(result.status).toBe(204);
      expect(result.body).toBeNull();
    });
  });

  describe('destroy', () => {
    it('should delete user and return 204', async () => {
      const result = await service.destroy('123');
      expect(mockUserSchema.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result.status).toBe(204);
      expect(result.body).toBeNull();
    });
  });
});
