'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

export function LaporanNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.includes(path);
  };
  
  return (
    <nav className="flex gap-4 mt-8 md:mt-16">
      <Link
        href={`/dashboard/laporan/penjualan`}
        className={clsx(
          'rounded-lg px-4 py-2 text-sm font-medium',
          {
            'bg-red-600 text-white': isActive('penjualan'),
            'bg-gray-100 text-gray-500 hover:bg-gray-200': !isActive('penjualan'),
          }
        )}
      >
        Penjualan
      </Link>
      <Link
        href={`/dashboard/laporan/pembelian`}
        className={clsx(
          'rounded-lg px-4 py-2 text-sm font-medium',
          {
            'bg-red-600 text-white': isActive('pembelian'),
            'bg-gray-100 text-gray-500 hover:bg-gray-200': !isActive('pembelian'),
          }
        )}
      >
        Pembelian
      </Link>
    </nav>
  );
} 