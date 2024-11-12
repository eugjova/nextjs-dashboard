'use client';

import Link from 'next/link';
import { InboxArrowDownIcon, EnvelopeIcon, UserCircleIcon, IdentificationIcon, PhoneIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updatePegawai } from '@/app/lib/action';
import { PegawaiForm } from '@/app/lib/definitions';
import React from 'react';

export default function Form({
  pegawai,
}: {
  pegawai: PegawaiForm;
}) {
  const updatePegawaiWithId = updatePegawai.bind(null, pegawai.id);

  return (
    <div className="place-content-center flex items-center justify-center">
      <div className="relative bg-white p-4 md:p-6 rounded-md shadow-md border border-gray-300 w-full max-w-xl">
        <form action={updatePegawaiWithId}>
          <div className="rounded-md bg-gray-50 p-4 md:p-6">
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Name
              </label>
              <div className="relative mt-2 rounded-md">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Name"
                  defaultValue={pegawai.name}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Phone
              </label>
              <div className="relative mt-2 rounded-md">
                <input
                  id="phone"
                  name="phone"
                  type="phone"
                  placeholder="Enter Phone"
                  defaultValue={pegawai.phone}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="mb-2 block text-sm font-medium">
                Gender
              </label>
              <div className="relative mt-2 rounded-md">
                <input
                  id="gender"
                  name="gender"
                  type="gender"
                  placeholder="Enter Gender"
                  defaultValue={pegawai.gender}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <div className="relative mt-2 rounded-md">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  defaultValue={pegawai.email}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="Password" className="mb-2 block text-sm font-medium">
               Password
              </label>
              <div className="relative mt-2 rounded-md">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  defaultValue={pegawai.password}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>

            {/* Upload Image */}
            {/* <div className="mb-4">
              <label htmlFor="image" className="mb-2 block text-sm font-medium">
                Upload Image
              </label>
              <div className="relative mt-2 rounded-md">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <span className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
                  <InboxArrowDownIcon />
                </span>
              </div>
              {customers.image_url && (
                <p className="mt-1 text-xs text-gray-500">Current Image: {customers.image_url}</p>
              )}
            </div> */}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/pegawai"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button type="submit">Edit Pegawai</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
