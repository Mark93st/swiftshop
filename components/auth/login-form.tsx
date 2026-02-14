'use client';

import { useState } from 'react';
import { authenticate } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    
    try {
      const result = await authenticate(undefined, formData);
      if (result) {
        setErrorMessage(result);
        setIsPending(false);
      } else {
        // Success: Redirect manually to profile
        router.push('/profile');
        router.refresh(); // Ensure session state is updated
      }
    } catch (error) {
      setErrorMessage('Something went wrong.');
      setIsPending(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                required
                minLength={6}
              />
            </div>
            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <p className="text-sm text-red-500 font-medium">
                  {errorMessage}
                </p>
              )}
            </div>
            <Button className="w-full" disabled={isPending}>
              {isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
           <p className="text-sm text-slate-500">
             Don&apos;t have an account?{' '}
             <Link href="/register" className="text-primary hover:underline">
               Sign up
             </Link>
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}