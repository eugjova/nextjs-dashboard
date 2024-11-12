'use client'

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { deleteProduct } from '@/app/lib/action';
import { useState } from 'react';

export function CreateProduct() {
  return (
    <Link
      href="/dashboard/products/create"
      className="flex h-10 items-center rounded-lg bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Product</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProduct({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/products/${id}/edit`}
      className="rounded-md border p-2 hover:bg-yellow-500"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteProduct({ id }: { id: string }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDelete = async () => {
    await deleteProduct(id);
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
          <div className="bg-slate-900 p-6 rounded-md shadow-md">
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
