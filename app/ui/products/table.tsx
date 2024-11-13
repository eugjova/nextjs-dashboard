import Image from 'next/image';
import { UpdateProduct, DeleteProduct } from '@/app/ui/products/buttons';
import { formatCurrency } from '@/app/lib/utils';
import { products } from '@/app/lib/placeholder-data';
import { fetchFilteredProducts } from '@/app/lib/data';

export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = await fetchFilteredProducts(query, currentPage);

  return (
    <div className="mt-6 flow-root ">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {products?.map((product) => (
          <div key={product.id} className="flex flex-col rounded-lg overflow-hidden shadow-lg">
            <div className="relative w-full h-48">
              <Image
                src={product.image_url}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>
            <div className="bg-black p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">{product.name}</h3>
                <p className="text-sm text-gray-400">Stock: {product.stock}</p>
              </div>
              <p className="mt-2 text-lg font-medium text-white">{formatCurrency(product.price)}</p>
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
