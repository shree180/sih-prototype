global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => '00000000-0000-0000-0000-000000000000',
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: async () => new ArrayBuffer(32),
    },
  },
});

jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/lib/db/local', () => ({
  query: jest.fn(),
  transaction: jest.fn(),
  setCurrentUser: jest.fn(),
  getPool: jest.fn(),
  closePool: jest.fn(),
}));

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/lib/auth/local', () => ({
  getSession: jest.fn(),
  createSession: jest.fn(),
  deleteSession: jest.fn(),
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  createUser: jest.fn(),
  authenticateUser: jest.fn(),
  getProfile: jest.fn(),
  getUserById: jest.fn(),
  ensureUsersTable: jest.fn(),
}));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));