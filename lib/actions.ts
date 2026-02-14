'use server';

import { signIn, signOut, auth } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { SignupFormSchema, ProductFormSchema, CategoryFormSchema } from '@/lib/definitions';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function checkAdmin() {
  const session = await auth();
  if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function updateUserRole(userId: string, newRole: 'USER' | 'ADMIN') {
  const session = await checkAdmin();
  
  if (session.user?.id === userId) {
    return { success: false, message: 'You cannot change your own role.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Update role error:', error);
    return { success: false, message: 'Failed to update user role.' };
  }
}

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
  const session = await checkAdmin();

  if (session.user?.id === userId) {
    return { success: false, message: 'You cannot suspend your own account.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !currentStatus }
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Toggle status error:', error);
    return { success: false, message: 'Failed to update user status.' };
  }
}

export async function deleteCategory(id: string) {
  await checkAdmin();
  try {
    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      return { success: false, message: 'Cannot delete category with existing products.' };
    }

    await prisma.category.delete({
      where: { id }
    });
    revalidatePath('/admin/categories');
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, message: 'Failed to delete category.' };
  }
}

export type CategoryState = {
  errors?: {
    name?: string[];
    slug?: string[];
  };
  message?: string | null;
};

export async function upsertCategory(
  id: string | undefined, 
  prevState: CategoryState | undefined, 
  formData: FormData
) {
  await checkAdmin();

  const validatedFields = CategoryFormSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to save category.',
    };
  }

  const data = validatedFields.data;

  try {
    if (id) {
      await prisma.category.update({
        where: { id },
        data
      });
    } else {
      await prisma.category.create({
        data
      });
    }
  } catch (error) {
    console.error('Save error:', error);
    return { message: 'Database Error: Failed to save category. Slug might be already in use.' };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/products');
  redirect('/admin/categories');
}

export async function deleteProduct(id: string) {
  await checkAdmin();
  try {
    await prisma.product.delete({
      where: { id }
    });
    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, message: 'Failed to delete product.' };
  }
}

export type ProductState = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    stock?: string[];
    imageUrl?: string[];
    categoryId?: string[];
  };
  message?: string | null;
};

export async function upsertProduct(
  id: string | undefined, 
  prevState: ProductState | undefined, 
  formData: FormData
) {
  await checkAdmin();

  const validatedFields = ProductFormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    imageUrl: formData.get('imageUrl'),
    categoryId: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to save product.',
    };
  }

  const data = validatedFields.data;

  try {
    if (id) {
      await prisma.product.update({
        where: { id },
        data
      });
    } else {
      await prisma.product.create({
        data
      });
    }
  } catch (error) {
    console.error('Save error:', error);
    return { message: 'Database Error: Failed to save product.' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function handleSignOut() {
  await signOut({ redirect: false });
  redirect('/');
}

export async function toggleFavorite(productId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  
  if (!userId) {
    throw new Error('You must be logged in to favorite items');
  }

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId: userId,
        productId: productId
      }
    }
  });

  if (existingFavorite) {
    await prisma.favorite.delete({
      where: { id: existingFavorite.id }
    });
    return { favorited: false };
  } else {
    await prisma.favorite.create({
      data: {
        userId: userId,
        productId: productId
      }
    });
    return { favorited: true };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function register(prevState: RegisterState | undefined, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Register.',
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return {
      message: 'Database Error: Failed to Create User. Email might be already in use.',
    };
  }

  redirect('/login');
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('You must be logged in to update your profile');
  }

  const name = formData.get('name') as string;

  if (!name || name.length < 2) {
    return { success: false, message: 'Name must be at least 2 characters long.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name }
    });
    revalidatePath('/profile');
    return { success: true, message: 'Profile updated successfully.' };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Failed to update profile.' };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await checkAdmin();

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any }
    });
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, message: 'Failed to update order status.' };
  }
}

export async function submitReview(productId: string, rating: number, comment: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: 'You must be logged in to leave a review.' };
  }

  // Check if user has purchased the product
  const hasPurchased = await prisma.order.findFirst({
    where: {
      userId,
      status: 'PAID', // or SHIPPED/DELIVERED
      orderItems: {
        some: {
          productId
        }
      }
    }
  });

  if (!hasPurchased) {
    return { success: false, message: 'You can only review products you have purchased.' };
  }

  try {
    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      update: {
        rating,
        comment
      },
      create: {
        userId,
        productId,
        rating,
        comment
      }
    });
    revalidatePath(`/products/${productId}`);
    return { success: true, message: 'Review submitted successfully!' };
  } catch (error) {
    console.error('Review submission error:', error);
    return { success: false, message: 'Failed to submit review.' };
  }
}
