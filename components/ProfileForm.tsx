'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('name', name);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {message.text}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
            <Input id="email" value={user.email} disabled className="bg-slate-50" />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your name"
              required
              minLength={2}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
