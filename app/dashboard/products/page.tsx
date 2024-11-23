import { Metadata } from 'next';
import React, { Suspense } from 'react';
import Search from '@/app/ui/search';
// import Pagination from '@/app/ui/customers/pagination';
import { oswald } from '@/app/ui/fonts';
import { 
  SearchSkeleton, 
  CreateSkeleton, 
  ProductsTableSkeleton
} from '@/app/ui/skeletons';
import Table from '@/app/ui/products/table';
import Form from '@/app/ui/products/create-form';
import { fetchProductsPages } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Products',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: any;
}) {
  const params = await Promise.resolve(searchParams);
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;
  // const totalPages = await fetchProductsPages(query);

  return (
    <div className="flex min-h-screen flex-col">
      <p className={`${oswald.variable} text-3xl text-white`}>Products Page</p>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<SearchSkeleton />}>
          <Search placeholder="Search products..." />
        </Suspense>
        <Suspense fallback={<CreateSkeleton />}>
      <Form products={[]} />
      </Suspense>
      </div>

      <div className="mt-6 flow-root">
        <Suspense key={query + currentPage} fallback={<ProductsTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div>

      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
