import { oswald } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  SearchSkeleton,
  CreateSkeleton,
} from '@/app/ui/skeletons';
import Search from '@/app/ui/search';
import Table from '@/app/ui/distributors/table';
import Form from '@/app/ui/distributors/create-form';
import { fetchDistributorPages } from '@/app/lib/data';
import Pagination from '@/app/ui/distributors/pagination';
import { Metadata } from 'next';
import DistributorsTableSkeleton from '@/app/ui/distributors/table-skeleton';
 
export const metadata: Metadata = {
  title: 'Distributor',
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
  const totalPages = await fetchDistributorPages(query);
 
  return (
    <div className="flex min-h-screen flex-col">
      <p className={`${oswald.variable} text-3xl text-white`}>Distributor Page</p>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<SearchSkeleton />}>
          <Search placeholder="Search distributor..." />
        </Suspense>
        <Suspense fallback={<CreateSkeleton />}>
          <Form />
        </Suspense>
      </div>

      <div className="mt flow-root">
        <Suspense key={query + currentPage} fallback={<DistributorsTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
