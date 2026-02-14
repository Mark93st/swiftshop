'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterForm() {
  const [state, dispatch, isPending] = useActionState(register, undefined);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none">Full Name</label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
              />
              {state?.errors?.name && (
                <p className="text-sm text-red-500">{state.errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
              {state?.errors?.email && (
                <p className="text-sm text-red-500">{state.errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                minLength={6}
              />
              {state?.errors?.password && (
                <p className="text-sm text-red-500">{state.errors.password}</p>
              )}
            </div>
            
            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {state?.message && (
                <p className="text-sm text-red-500 font-medium">
                  {state.message}
                </p>
              )}
            </div>
            
            <Button className="w-full" disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
           <p className="text-sm text-slate-500">
             Already have an account?{' '}
             <Link href="/login" className="text-primary hover:underline">
               Login
             </Link>
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}
