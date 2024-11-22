import Pagination from '@/app/ui/penjualan/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/detailpembelian/table';
import { oswald } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  SearchSkeleton,
  InvoicesTableSkeleton,
  CreateSkeleton,
} from '@/app/ui/skeletons'; 
import { Metadata } from 'next';
import Form from '@/app/ui/penjualan/create-form';

export const metadata: Metadata = {
  title: 'Detail Transaksi Pembelian',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  // Tunggu searchParams selesai diproses
  const params = await Promise.resolve(searchParams);
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;

  return (
    <div className="flex min-h-screen flex-col">
      <p className={`${oswald.variable} text-3xl text-white`}>Pembelian Page</p>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<SearchSkeleton />}>
          <Search placeholder="Search..." />
        </Suspense>
        <Suspense fallback={<CreateSkeleton />}>
          {/* <Form customers={customers} products={products}/> */}
        </Suspense>
      </div>

      <div className="mt flow-root">
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div>

      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}