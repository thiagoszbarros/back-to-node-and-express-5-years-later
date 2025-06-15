import { Roles } from './roles.js';

describe('roles', () => {
  it('should export expected roles', () => {
    expect(Roles).toBeDefined();
    expect(Roles).toHaveProperty('USER');
    expect(Roles).toHaveProperty('ADMIN');
  });
});
