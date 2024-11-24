'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="inline-flex gap-2">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          return (
            <Link
              key={pageNumber}
              href={createPageURL(pageNumber)}
              className={clsx(
                'flex h-10 w-10 items-center justify-center rounded-lg text-sm',
                {
                  'bg-red-600 text-white': pageNumber === currentPage,
                  'bg-gray-100 text-gray-400 hover:bg-gray-200': pageNumber !== currentPage,
                },
              )}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-lg',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100': !isDisabled,
    },
  );

  const Icon = direction === 'left' ? ArrowLeftIcon : ArrowRightIcon;

  return isDisabled ? (
    <div className={className}>
      <Icon className="w-4" />
    </div>
  ) : (
    <Link className={className} href={href}>
      <Icon className="w-4" />
    </Link>
  );
} 