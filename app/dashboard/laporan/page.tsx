import { LaporanNav } from '@/app/ui/laporan/nav';
import { Suspense } from 'react';
import { SearchSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Laporan',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    type?: string;
  };
}) {
  const params = await Promise.resolve(searchParams);
  const type = params?.type || 'penjualan';

  if (type === 'penjualan') {
    redirect('/dashboard/laporan/penjualan');
  } else if (type === 'pembelian') {
    redirect('/dashboard/laporan/pembelian');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mt-4">
        <LaporanNav />
      </div>
      <div className="mt-8">
        <Suspense fallback={<SearchSkeleton />}>
        </Suspense>
      </div>
    </div>
  );
} 