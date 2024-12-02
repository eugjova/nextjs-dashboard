'use client'

import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

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
