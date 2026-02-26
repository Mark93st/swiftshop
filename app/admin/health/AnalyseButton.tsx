'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { triggerAnalysis } from './actions';
import { toast } from 'sonner';

export function AnalyseButton({ 
  errorId, 
  message, 
  stack 
}: { 
  errorId: string, 
  message: string, 
  stack?: string | null 
}) {
  const [isPending, setIsPending] = useState(false);

  const handleAnalysis = async () => {
    setIsPending(true);
    try {
      const result = await triggerAnalysis(errorId, message, stack || undefined);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Analysis complete!');
      }
    } catch (error) {
      toast.error('Failed to trigger analysis.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-6 text-slate-500 bg-white/50 rounded-xl border border-dashed border-slate-200">
      <Sparkles className="h-8 w-8 mb-3 text-slate-300" />
      <p className="text-sm mb-4">No AI diagnosis exists for this incident yet.</p>
      <Button 
        onClick={handleAnalysis} 
        disabled={isPending}
        className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-bold"
      >
        {isPending ? 'Analyzing...' : 'Generate AI Analysis'}
      </Button>
    </div>
  );
}
