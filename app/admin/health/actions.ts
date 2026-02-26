'use server';

import { checkAdmin } from '@/lib/actions';
import { diagnoseError } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export async function triggerAnalysis(errorId: string, message: string, stack?: string) {
  try {
    await checkAdmin();
    await diagnoseError(errorId, message, stack);
    revalidatePath('/admin/health');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to trigger analysis manually:', error);
    return { error: error.message || 'Failed to trigger analysis.' };
  }
}
