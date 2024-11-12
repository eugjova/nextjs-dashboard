import { oswald } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  SearchSkeleton,
  CreateSkeleton,
  // CustomersTableSkeleton
} from '@/app/ui/skeletons';
import Search from '@/app/ui/search';
import Table from '@/app/ui/customers/table';
import Form from '@/app/ui/customers/create-form';
import { fetchCustomersPages } from '@/app/lib/data';
// import Pagination from '@/app/ui/customers/pagination';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page(
  {
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  // const totalPages = await fetchCustomersPages(query);
 
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <div className="flex min-h-screen flex-col">
         <p className={`${oswald.className} text-3xl text-white`}>Customer Page</p>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<SearchSkeleton />}>
          <Search placeholder="Search customers..." />
        </Suspense>
        <Suspense fallback={<CreateSkeleton />}>
          <Form />
        </Suspense>
      </div>

      <Table query={query} currentPage={currentPage} />
      {/* <div className="mt flow-root">
        <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div> */}

      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
