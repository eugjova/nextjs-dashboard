import { oswald } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  SearchSkeleton,
  CreateSkeleton,
} from '@/app/ui/skeletons';
import Search from '@/app/ui/search';
import Table from '@/app/ui/customers/table';
import Form from '@/app/ui/customers/create-form';
import { fetchCustomersPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: any;
}) {
  const query = (await searchParams)?.query || '';
  const currentPage = Number((await searchParams)?.page) || 1;

  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  return (
    <div className="flex min-h-screen flex-col">
      <p className={`${oswald.variable} text-3xl text-white`}>Customer Page</p>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<SearchSkeleton />}>
          <Search placeholder="Search customers..." />
        </Suspense>
        <Suspense fallback={<CreateSkeleton />}>
          <Form />
        </Suspense>
      </div>

      <Table query={query} currentPage={currentPage} />

      <div className="mt-5 flex w-full justify-center">
      </div>
    </div>
  );
}
