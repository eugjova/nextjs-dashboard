import { Metadata } from 'next';
import { oswald } from '@/app/ui/fonts';
import { fetchProductsPages, fetchDistributor } from '@/app/lib/data';
import ProductsList from '@/app/ui/products/products-list';

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
  
  const [distributors, totalPages] = await Promise.all([
    fetchDistributor(),
    fetchProductsPages(query)
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <p className={`${oswald.variable} text-3xl text-white`}>Products Page</p>
      <ProductsList 
        distributors={distributors}
        query={query}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
