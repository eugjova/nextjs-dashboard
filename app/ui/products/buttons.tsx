'use client'

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

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

export function UpdateProduct({ id, className }: { id: string, className?: string }) {
  return (
    <PencilIcon className={className} />
  );
}

export function DeleteProduct({ 
  id, 
  className
}: { 
  id: string, 
  className?: string
}) {
  return (
    <TrashIcon className={className} />
  );
}
