import authService from './auth.service.js';
import { fn } from 'jest-mock';

const mockUserSchema = {
  findOne: fn(),
  save: fn(),
  select: fn(),
};
const mockBcrypt = {
  hash: fn(),
  compare: fn(),
};
const mockJwt = {
  sign: fn(),
};
const mockCrypto = {
  randomBytes: fn(),
};

const mockRes = () => {
  const res = {};
  res.status = fn().mockReturnValue(res);
  res.json = fn().mockReturnValue(res);
  res.send = fn().mockReturnValue(res);
  return res;
};

describe('authService', () => {
  let service;
  let req;
  let res;

  beforeEach(() => {
    Object.values(mockUserSchema).forEach(f => f.mockClear && f.mockClear());
    Object.values(mockBcrypt).forEach(f => f.mockClear && f.mockClear());
    mockJwt.sign.mockClear();
    mockCrypto.randomBytes.mockClear();
    service = authService({
      repository: mockUserSchema,
      encrypter: mockBcrypt,
      jwtLib: mockJwt,
      cryptoLib: mockCrypto,
    });
    req = { body: {}, params: {} };
    res = mockRes();
  });

  describe('register', () => {
    it('should return 400 if username or password is missing', async () => {
      req.body = {};
      await service.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Username and password are required.' });
    });
    it('should return 409 if user exists', async () => {
      req.body = { username: 'user', password: 'pass' };
      mockUserSchema.findOne.mockResolvedValueOnce(true);
      await service.register(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'Username already exists.' });
    });
    it('should create user and return 201', async () => {
      req.body = { username: 'user', password: 'pass' };
      mockUserSchema.findOne.mockResolvedValueOnce(null);
      mockBcrypt.hash.mockResolvedValueOnce('hashed');
      const saveMock = fn();
      function User(data) { return { ...data, save: saveMock }; }
      User.findOne = mockUserSchema.findOne;
      service = authService({ repository: User, encrypter: mockBcrypt });
      await service.register(req, res);
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully.' });
    });
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      req.body = { username: 'user', password: 'pass' };
      // Return an object with a select method that returns null
      mockUserSchema.findOne.mockReturnValueOnce({ select: () => null });
      await service.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials.' });
    });
    it('should return 401 if password does not match', async () => {
      req.body = { username: 'user', password: 'pass' };
      const user = { username: 'user', password: 'hashed', role: 'user' };
      mockUserSchema.findOne.mockReturnValueOnce({ select: () => user });
      mockBcrypt.compare.mockResolvedValueOnce(false);
      await service.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials.' });
    });
    it('should return token if credentials are valid', async () => {
      req.body = { username: 'user', password: 'pass' };
      const user = { _id: 'id', username: 'user', password: 'hashed', role: 'user' };
      mockUserSchema.findOne.mockReturnValueOnce({ select: () => user });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      mockJwt.sign.mockReturnValueOnce('token');
      await service.login(req, res);
      expect(res.json).toHaveBeenCalledWith({ token: 'token' });
    });
  });

  describe('passwordResetToken', () => {
    it('should return 200 if user not found', async () => {
      req.body = { username: 'user' };
      mockUserSchema.findOne.mockResolvedValueOnce(null);
      await service.passwordResetToken(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'If the user exists, a reset link will be sent.' });
    });
    it('should generate token and return it', async () => {
      req.body = { username: 'user' };
      const user = { save: fn() };
      mockUserSchema.findOne.mockResolvedValueOnce(user);
      mockCrypto.randomBytes.mockReturnValueOnce({ toString: () => 'token' });
      await service.passwordResetToken(req, res);
      expect(user.token).toBe('token');
      expect(user.expiresIn).toBeGreaterThan(Date.now());
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'token' }));
    });
  });

  describe('passwordReset', () => {
    it('should return 400 if user not found or token expired', async () => {
      req.body = { token: 'token', newPassword: 'new' };
      mockUserSchema.findOne.mockResolvedValueOnce(null);
      await service.passwordReset(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token.' });
    });
    it('should reset password and clear token', async () => {
      req.body = { token: 'token', newPassword: 'new' };
      const user = { save: fn() };
      mockUserSchema.findOne.mockResolvedValueOnce(user);
      mockBcrypt.hash.mockResolvedValueOnce('hashed');
      await service.passwordReset(req, res);
      expect(user.password).toBe('hashed');
      expect(user.token).toBeUndefined();
      expect(user.expiresIn).toBeUndefined();
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Password has been reset successfully.' });
    });
  });
});
