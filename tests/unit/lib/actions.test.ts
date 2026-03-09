import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mocks must be declared before importing the module under test ---
vi.mock('@/auth', () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      update: vi.fn(),
    },
    product: {
      count: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    category: {
      delete: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    favorite: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    order: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    review: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('bcryptjs', () => ({
  default: { hash: vi.fn().mockResolvedValue('hashed-password') },
}));

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  checkAdmin,
  updateUserRole,
  toggleUserStatus,
  deleteCategory,
  register,
  updateProfile,
  toggleFavorite,
} from '@/lib/actions';

const mockAuth = vi.mocked(auth);

const adminSession = {
  user: { id: 'admin-id', email: 'admin@example.com', role: 'ADMIN' as const },
  expires: '2099-01-01',
};
const userSession = {
  user: { id: 'user-id', email: 'user@example.com', role: 'USER' as const },
  expires: '2099-01-01',
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
describe('checkAdmin', () => {
  it('returns the session for an authenticated admin', async () => {
    mockAuth.mockResolvedValue(adminSession);
    await expect(checkAdmin()).resolves.toEqual(adminSession);
  });

  it('throws for an unauthenticated user', async () => {
    mockAuth.mockResolvedValue(null);
    await expect(checkAdmin()).rejects.toThrow('Unauthorized');
  });

  it('throws for a non-admin user', async () => {
    mockAuth.mockResolvedValue(userSession);
    await expect(checkAdmin()).rejects.toThrow('Unauthorized');
  });
});

// ---------------------------------------------------------------------------
describe('updateUserRole', () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue(adminSession);
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);
  });

  it('updates the role for another user', async () => {
    const result = await updateUserRole('other-user-id', 'ADMIN');
    expect(result).toEqual({ success: true });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'other-user-id' },
      data: { role: 'ADMIN' },
    });
  });

  it('prevents an admin from changing their own role', async () => {
    const result = await updateUserRole('admin-id', 'USER');
    expect(result).toEqual({ success: false, message: 'You cannot change your own role.' });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('returns an error message when the DB call fails', async () => {
    vi.mocked(prisma.user.update).mockRejectedValue(new Error('DB error'));
    const result = await updateUserRole('other-user-id', 'USER');
    expect(result).toEqual({ success: false, message: 'Failed to update user role.' });
  });
});

// ---------------------------------------------------------------------------
describe('toggleUserStatus', () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue(adminSession);
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);
  });

  it('toggles the status for another user', async () => {
    const result = await toggleUserStatus('other-user-id', true);
    expect(result).toEqual({ success: true });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'other-user-id' },
      data: { isActive: false },
    });
  });

  it('prevents an admin from suspending themselves', async () => {
    const result = await toggleUserStatus('admin-id', true);
    expect(result).toEqual({ success: false, message: 'You cannot suspend your own account.' });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
describe('deleteCategory', () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue(adminSession);
  });

  it('deletes a category that has no products', async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(0);
    vi.mocked(prisma.category.delete).mockResolvedValue({} as any);
    const result = await deleteCategory('cat-1');
    expect(result).toEqual({ success: true });
    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 'cat-1' } });
  });

  it('blocks deletion when the category has products', async () => {
    vi.mocked(prisma.product.count).mockResolvedValue(3);
    const result = await deleteCategory('cat-1');
    expect(result).toEqual({ success: false, message: 'Cannot delete category with existing products.' });
    expect(prisma.category.delete).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
describe('register', () => {
  const validFormData = (overrides: Record<string, string> = {}) => {
    const data = { name: 'Alice', email: 'alice@example.com', password: 'password123', ...overrides };
    return {
      get: (key: string) => data[key] ?? null,
    } as unknown as FormData;
  };

  beforeEach(() => {
    vi.mocked(prisma.user.create).mockResolvedValue({} as any);
  });

  it('returns validation errors for a short name', async () => {
    const result = await register(undefined, validFormData({ name: 'A' }));
    expect(result?.errors?.name).toBeDefined();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('returns validation errors for an invalid email', async () => {
    const result = await register(undefined, validFormData({ email: 'bad' }));
    expect(result?.errors?.email).toBeDefined();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('returns validation errors for a short password', async () => {
    const result = await register(undefined, validFormData({ password: 'abc' }));
    expect(result?.errors?.password).toBeDefined();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('creates a user and calls redirect for valid input', async () => {
    const { redirect } = await import('next/navigation');
    await register(undefined, validFormData());
    expect(prisma.user.create).toHaveBeenCalledOnce();
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('returns a DB error message when creation fails', async () => {
    vi.mocked(prisma.user.create).mockRejectedValue(new Error('Unique constraint'));
    const result = await register(undefined, validFormData());
    expect(result?.message).toContain('Database Error');
  });
});

// ---------------------------------------------------------------------------
describe('updateProfile', () => {
  const makeFormData = (name: string) =>
    ({ get: () => name } as unknown as FormData);

  beforeEach(() => {
    mockAuth.mockResolvedValue(userSession);
    vi.mocked(prisma.user.update).mockResolvedValue({} as any);
  });

  it('updates the name for an authenticated user', async () => {
    const result = await updateProfile(makeFormData('Bob'));
    expect(result).toEqual({ success: true, message: 'Profile updated successfully.' });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-id' },
      data: { name: 'Bob' },
    });
  });

  it('rejects a name shorter than 2 characters', async () => {
    const result = await updateProfile(makeFormData('A'));
    expect(result).toEqual({ success: false, message: 'Name must be at least 2 characters long.' });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('throws if the user is not logged in', async () => {
    mockAuth.mockResolvedValue(null);
    await expect(updateProfile(makeFormData('Bob'))).rejects.toThrow('You must be logged in');
  });
});

// ---------------------------------------------------------------------------
describe('toggleFavorite', () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue(userSession);
  });

  it('creates a favorite when none exists', async () => {
    vi.mocked(prisma.favorite.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.favorite.create).mockResolvedValue({} as any);
    const result = await toggleFavorite('product-1');
    expect(result).toEqual({ favorited: true });
    expect(prisma.favorite.create).toHaveBeenCalled();
  });

  it('removes a favorite when one already exists', async () => {
    vi.mocked(prisma.favorite.findUnique).mockResolvedValue({ id: 'fav-1' } as any);
    vi.mocked(prisma.favorite.delete).mockResolvedValue({} as any);
    const result = await toggleFavorite('product-1');
    expect(result).toEqual({ favorited: false });
    expect(prisma.favorite.delete).toHaveBeenCalledWith({ where: { id: 'fav-1' } });
  });

  it('throws if the user is not logged in', async () => {
    mockAuth.mockResolvedValue(null);
    await expect(toggleFavorite('product-1')).rejects.toThrow('must be logged in');
  });
});
