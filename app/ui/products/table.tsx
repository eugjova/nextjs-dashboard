import Image from 'next/image';
import { UpdateProduct, DeleteProduct } from '@/app/ui/products/buttons';
import { formatCurrency } from '@/app/lib/utils';
import { products } from '@/app/lib/placeholder-data';
// import { fetchFilteredProducts } from '@/app/lib/data';

export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // const products = await fetchFilteredProducts(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 ">
        {products?.map((product) => (
            <div>
              <div className="aspect-w-1 aspect-h-1 ove+rflow-hidden rounded-lg bg-gray-100 bg-auto">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="bg-black p-2 rounded-b-lg">
                <h3 className="mt-4 text-xl text-gray-200">{product.name}</h3>
                <p className="mt-2 text-lg text-gray-400">Stock: {product.stock}</p>
                <p className="mt-4 text-xl font-medium text-white">{formatCurrency(product.price)}</p>
                <div className="flex justify-end space-x-2 mt-4 text-white">
                  <UpdateProduct id={product.id} />
                  <DeleteProduct id={product.id} />
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}
