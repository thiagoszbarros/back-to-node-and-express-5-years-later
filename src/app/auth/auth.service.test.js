import authService from './auth.service.js';
import { fn } from 'jest-mock';

function mockFindOneSelect(user) {
  return { select: fn().mockReturnValue(user) };
}

function createRepositoryMock() {
  const saveMock = fn();
  function Repository(data) {
    Object.assign(this, data);
    this.save = saveMock;
  }
  Repository.findOne = fn();
  return { Repository, saveMock };
}

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

describe('authService', () => {
  let service, repo, saveMock;
  beforeEach(() => {
    Object.values(mockBcrypt).forEach(f => f.mockClear && f.mockClear());
    mockJwt.sign.mockClear();
    mockCrypto.randomBytes.mockClear();
    const repoObj = createRepositoryMock();
    repo = repoObj.Repository;
    saveMock = repoObj.saveMock;
    service = authService({
      repository: repo,
      encrypter: mockBcrypt,
      jwtLib: mockJwt,
      cryptoLib: mockCrypto,
    });
  });

  describe('register', () => {
    it('should return 400 if username or password is missing', async () => {
      repo.findOne.mockResolvedValueOnce(undefined);
      const result = await service.register({});
      expect(result.status).toBe(400);
      expect(result.body).toEqual({ message: 'Username and password are required.' });
    });
    it('should return 409 if user exists', async () => {
      repo.findOne.mockResolvedValueOnce(true);
      const result = await service.register({ username: 'user', password: 'pass' });
      expect(result.status).toBe(409);
      expect(result.body).toEqual({ message: 'Username already exists.' });
    });
    it('should create user and return 201', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      mockBcrypt.hash.mockResolvedValueOnce('hashed');
      const result = await service.register({ username: 'user', password: 'pass' });
      expect(saveMock).toHaveBeenCalled();
      expect(result.status).toBe(201);
      expect(result.body).toEqual({ message: 'User registered successfully.' });
    });
  });

  describe('login', () => {
    it('should return 401 if user not found', async () => {
      repo.findOne.mockReturnValueOnce(mockFindOneSelect(null));
      const result = await service.login({ username: 'user', password: 'pass' });
      expect(result.status).toBe(401);
      expect(result.body).toEqual({ message: 'Invalid credentials.' });
    });
    it('should return 401 if password does not match', async () => {
      const user = { username: 'user', password: 'hashed', role: 'user' };
      repo.findOne.mockReturnValueOnce(mockFindOneSelect(user));
      mockBcrypt.compare.mockResolvedValueOnce(false);
      const result = await service.login({ username: 'user', password: 'pass' });
      expect(result.status).toBe(401);
      expect(result.body).toEqual({ message: 'Invalid credentials.' });
    });
    it('should return token if credentials are valid', async () => {
      const user = { _id: 'id', username: 'user', password: 'hashed', role: 'user' };
      repo.findOne.mockReturnValueOnce(mockFindOneSelect(user));
      mockBcrypt.compare.mockResolvedValueOnce(true);
      mockJwt.sign.mockReturnValueOnce('token');
      const result = await service.login({ username: 'user', password: 'pass' });
      expect(result.status).toBe(200);
      expect(result.body).toEqual({ token: 'token' });
    });
  });

  describe('passwordResetToken', () => {
    it('should return 200 if user not found', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      const result = await service.passwordResetToken({ username: 'user' });
      expect(result.status).toBe(200);
      expect(result.body).toEqual({ message: 'If the user exists, a reset link will be sent.' });
    });
    it('should generate token and return it', async () => {
      const user = { save: fn() };
      repo.findOne.mockResolvedValueOnce(user);
      mockCrypto.randomBytes.mockReturnValueOnce({ toString: () => 'token' });
      const result = await service.passwordResetToken({ username: 'user' });
      expect(user.token).toBe('token');
      expect(user.expiresIn).toBeGreaterThan(Date.now() - 1000); // allow for timing
      expect(user.save).toHaveBeenCalled();
      expect(result.body).toEqual(expect.objectContaining({ token: 'token' }));
    });
  });

  describe('passwordReset', () => {
    it('should return 400 if user not found or token expired', async () => {
      repo.findOne.mockResolvedValueOnce(null);
      const result = await service.passwordReset({ token: 'token', password: 'new' });
      expect(result.status).toBe(400);
      expect(result.body).toEqual({ message: 'Invalid or expired token.' });
    });
    it('should reset password and clear token', async () => {
      const user = { save: fn() };
      repo.findOne.mockResolvedValueOnce(user);
      mockBcrypt.hash.mockResolvedValueOnce('hashed');
      const result = await service.passwordReset({ token: 'token', password: 'new' });
      expect(user.password).toBe('hashed');
      expect(user.token).toBeUndefined();
      expect(user.expiresIn).toBeUndefined();
      expect(user.save).toHaveBeenCalled();
      expect(result.body).toEqual({ message: 'Password has been reset successfully.' });
    });
  });
});
