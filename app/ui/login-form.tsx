'use client';

import { roboto, oswald } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightCircleIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email || !password) {
        setError('Email dan password harus diisi');
        setIsSubmitting(false);
        return;
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah');
        toast.error('Email atau password salah');
      } else if (result?.ok) {
        toast.success('Login berhasil!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Terjadi kesalahan sistem');
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-purple-700 bg-opacity-0 px-6 pb-4 pt-8">
        <h1 className={`${oswald.variable} mb-3 text-xl`}>
          Silakan login untuk melanjutkan.
        </h1>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="w-full">
          <div>
            <label
              className={`${oswald.variable} mb-3 mt-5 block text-xs font-medium text-black`}
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className={`${roboto.variable} peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-black text-sm outline-2 placeholder:text-gray-500`}
                id="email"
                type="email"
                name="email"
                placeholder="Masukkan alamat email"
                required
                disabled={isSubmitting}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className={`${oswald.variable} mb-3 mt-5 block text-xs font-medium text-black`}
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className={`${roboto.variable} peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-black text-sm outline-2 placeholder:text-gray-500`}
                id="password"
                type="password"
                name="password"
                placeholder="Masukkan password"
                required
                minLength={6}
                disabled={isSubmitting}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button
            className="w-full"
            aria-disabled={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sedang login...' : 'Login'}{' '}
            <ArrowRightCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </div>
      </div>
    </form>
  );
}
