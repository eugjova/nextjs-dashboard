'use client';

import { roboto, oswald } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightCircleIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useState } from 'react';
import { authenticate } from '../lib/action';

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function dispatch(formData: FormData) {
    try {
      setPending(true);
      const errorMessage = await authenticate(undefined, formData);
      if (errorMessage) {
        setErrorMessage(errorMessage); // Set error message jika ada
      } else {
        setErrorMessage(null); // Reset error message jika berhasil
      }
    } catch (error: any) {
      setErrorMessage('an unexpected error ocurred.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          dispatch(formData);
        }}
        className="space-y-3"
      >
      <div className="flex-1 rounded-lg bg-purple-700 bg-opacity-0 px-6 pb-4 pt-8">
        <h1 className={`${oswald.variable} mb-3 text-xl`}>
          Please log in to continue.
        </h1>
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
                placeholder="Enter your email address"
                required
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
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <LoginButton pending={pending} />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function LoginButton({ pending }: { pending: boolean }) {
  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
