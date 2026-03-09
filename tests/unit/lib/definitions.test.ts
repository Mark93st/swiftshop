import { describe, it, expect } from 'vitest';
import {
  SignupFormSchema,
  LoginFormSchema,
  ProductFormSchema,
  CategoryFormSchema,
} from '@/lib/definitions';

describe('SignupFormSchema', () => {
  const valid = { name: 'Alice Smith', email: 'alice@example.com', password: 'secret1' };

  it('accepts valid input', () => {
    expect(SignupFormSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const result = SignupFormSchema.safeParse({ ...valid, name: 'A' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });

  it('rejects invalid email', () => {
    const result = SignupFormSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email).toBeDefined();
  });

  it('rejects password shorter than 6 characters', () => {
    const result = SignupFormSchema.safeParse({ ...valid, password: 'abc' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });
});

describe('LoginFormSchema', () => {
  const valid = { email: 'alice@example.com', password: 'anypassword' };

  it('accepts valid input', () => {
    expect(LoginFormSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = LoginFormSchema.safeParse({ ...valid, email: 'bad' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email).toBeDefined();
  });

  it('rejects empty password', () => {
    const result = LoginFormSchema.safeParse({ ...valid, password: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });
});

describe('ProductFormSchema', () => {
  const valid = {
    name: 'Wireless Headphones',
    description: 'High quality sound with noise cancellation.',
    price: '49.99',
    stock: '10',
    imageUrl: 'https://example.com/image.jpg',
    categoryId: 'cat-1',
  };

  it('accepts valid input', () => {
    expect(ProductFormSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts an empty imageUrl (optional field)', () => {
    expect(ProductFormSchema.safeParse({ ...valid, imageUrl: '' }).success).toBe(true);
  });

  it('rejects name shorter than 3 characters', () => {
    const result = ProductFormSchema.safeParse({ ...valid, name: 'Ab' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });

  it('rejects description shorter than 10 characters', () => {
    const result = ProductFormSchema.safeParse({ ...valid, description: 'Too short' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.description).toBeDefined();
  });

  it('rejects zero price', () => {
    const result = ProductFormSchema.safeParse({ ...valid, price: '0' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.price).toBeDefined();
  });

  it('rejects negative price', () => {
    const result = ProductFormSchema.safeParse({ ...valid, price: '-5' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.price).toBeDefined();
  });

  it('rejects negative stock', () => {
    const result = ProductFormSchema.safeParse({ ...valid, stock: '-1' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.stock).toBeDefined();
  });

  it('rejects invalid image URL', () => {
    const result = ProductFormSchema.safeParse({ ...valid, imageUrl: 'not-a-url' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.imageUrl).toBeDefined();
  });

  it('rejects missing categoryId', () => {
    const result = ProductFormSchema.safeParse({ ...valid, categoryId: '' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.categoryId).toBeDefined();
  });

  it('coerces string price and stock to numbers', () => {
    const result = ProductFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.price).toBe('number');
      expect(typeof result.data.stock).toBe('number');
    }
  });
});

describe('CategoryFormSchema', () => {
  const valid = { name: 'Electronics', slug: 'electronics' };

  it('accepts valid input', () => {
    expect(CategoryFormSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts slugs with numbers and hyphens', () => {
    expect(CategoryFormSchema.safeParse({ ...valid, slug: 'home-garden-2' }).success).toBe(true);
  });

  it('rejects name shorter than 2 characters', () => {
    const result = CategoryFormSchema.safeParse({ ...valid, name: 'A' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });

  it('rejects slug with uppercase letters', () => {
    const result = CategoryFormSchema.safeParse({ ...valid, slug: 'Electronics' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.slug).toBeDefined();
  });

  it('rejects slug with spaces', () => {
    const result = CategoryFormSchema.safeParse({ ...valid, slug: 'my category' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.slug).toBeDefined();
  });

  it('rejects slug with special characters', () => {
    const result = CategoryFormSchema.safeParse({ ...valid, slug: 'my_category!' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.slug).toBeDefined();
  });

  it('rejects slug shorter than 2 characters', () => {
    const result = CategoryFormSchema.safeParse({ ...valid, slug: 'a' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.slug).toBeDefined();
  });
});
