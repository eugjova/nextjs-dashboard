import Pagination from '@/app/ui/penjualan/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/penjualan/table';
import { oswald } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { 
  fetchPenjualanPages, 
  fetchCustomers, 
  fetchProducts, 
  fetchPegawai,
} from '@/app/lib/data';
import {
  SearchSkeleton,
  InvoicesTableSkeleton,
  CreateSkeleton,
} from '@/app/ui/skeletons'; 
import { Metadata } from 'next';
import Form from '@/app/ui/penjualan/create-form';
import { CreatePenjualan } from '@/app/ui/penjualan/buttons';
import { products } from '@/app/lib/placeholder-data';

export const metadata: Metadata = {
  title: 'Penjualan',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const params = await Promise.resolve(searchParams);
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;
  
  // Fetch data yang diperlukan
  const customers = await fetchCustomers();
  const products = await fetchProducts();
  const productsWithDistributor = products.map(product => ({
    ...product,
    distributorId: ''
  }));
  const pegawai = await fetchPegawai();
  const totalPages = await fetchPenjualanPages(query);

  return (
    <div className="flex min-h-screen flex-col">
      <p className={`${oswald.variable} text-3xl text-white`}>Penjualan Page</p>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<SearchSkeleton />}>
          <Search placeholder="Search penjualan..." />
        </Suspense>
        <Suspense fallback={<CreateSkeleton />}>
          <Form 
            customers={customers} 
            products={productsWithDistributor}
            pegawai={pegawai}
          />
        </Suspense>
      </div>

      <div className="mt flow-root">
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}