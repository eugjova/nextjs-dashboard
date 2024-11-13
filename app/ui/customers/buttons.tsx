'use client'

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCustomer } from '@/app/lib/action';
import { useState } from 'react';
 
export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customer</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
 
export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
    href={`/dashboard/customers/${id}/edit`}
      className="rounded-md border p-2 hover:bg-yellow-500"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
 
export function DeleteCustomer({ id }: { id: string }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDelete = async () => {
    await deleteCustomer(id);
    setModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="rounded-md border p-2 hover:bg-red-500"
        onClick={() => setModalOpen(true)}
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-500 p-6 rounded-md shadow-md">
            <h3 className="font-bold text-lg mb-4">Are you sure you want to delete this data?</h3>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <form action={handleDelete}>
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}