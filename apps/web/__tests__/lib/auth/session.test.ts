import { getSession, createSession, deleteSession } from '@/lib/auth/session';

describe('lib/auth/session', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createSession', () => {
    it('should create a signed session token containing payload', () => {
      const token = createSession('user-123', 'citizen');

      expect(typeof token).toBe('string');
      expect(token).toContain('.');

      const session = getSession(token);
      expect(session).not.toBeNull();
      expect(session?.userId).toBe('user-123');
      expect(session?.role).toBe('citizen');
      expect(session?.expiresAt).toBeGreaterThan(Date.now());
    });

    it('should set expiration to 7 days from now', () => {
      const now = Date.now();
      const token = createSession('user-123', 'citizen');
      const session = getSession(token);

      expect(session!.expiresAt).toBe(now + 7 * 24 * 60 * 60 * 1000);
    });
  });

  describe('getSession', () => {
    it('should return session data for valid token', () => {
      const token = createSession('user-123', 'authority');
      const session = getSession(token);

      expect(session).toEqual({
        userId: 'user-123',
        role: 'authority',
        expiresAt: expect.any(Number),
      });
    });

    it('should return null for non-existent or invalid token', () => {
      const session = getSession('non-existent-token');
      expect(session).toBeNull();
    });

    it('should return null for tampered token', () => {
      const token = createSession('user-123', 'citizen');
      const parts = token.split('.');
      const tampered = `${parts[0]}tampered.${parts[1]}`;
      expect(getSession(tampered)).toBeNull();
    });

    it('should return null for expired session', () => {
      const token = createSession('user-123', 'citizen');
      
      // Advance time past expiration (7 days + 1ms)
      jest.advanceTimersByTime(7 * 24 * 60 * 60 * 1000 + 1);
      
      const session = getSession(token);
      expect(session).toBeNull();
    });

    it('should return null for empty token', () => {
      expect(getSession('')).toBeNull();
      expect(getSession(null as any)).toBeNull();
      expect(getSession(undefined as any)).toBeNull();
    });
  });

  describe('deleteSession', () => {
    it('should handle deleting session gracefully', () => {
      const token = createSession('user-123', 'citizen');
      expect(() => deleteSession(token)).not.toThrow();
    });
  });

  describe('multiple users', () => {
    it('should handle multiple sessions independently', () => {
      const token1 = createSession('user-1', 'citizen');
      const token2 = createSession('user-2', 'authority');

      expect(getSession(token1)?.userId).toBe('user-1');
      expect(getSession(token2)?.userId).toBe('user-2');
      expect(getSession(token1)?.role).toBe('citizen');
      expect(getSession(token2)?.role).toBe('authority');
    });
  });
});