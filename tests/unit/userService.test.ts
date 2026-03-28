import { hashPassword, comparePassword } from '../../src/utils/passwordUtils.js';
describe('userService password utilities', () => {
  it('should hash and verify password correctly', async () => {
    const plain = 'MyS3curePassword';
    const hash = await hashPassword(plain);
    expect(hash).not.toEqual(plain);
    expect(typeof hash).toBe('string');
    const matches = await comparePassword(plain, hash);
    expect(matches).toBe(true);
    const wrong = await comparePassword('wrongPass', hash);
    expect(wrong).toBe(false);
  });
});
