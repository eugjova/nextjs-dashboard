import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { oswald } from '@/app/ui/fonts';
import { customers } from '@/app/lib/placeholder-data';

export default async function Customers()
{
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-950 p-4">
        <h2 className={`${oswald.variable} text-white mb-4 text-xl md:text-2xl`}>
          Customers
        </h2>
        <div className="bg-black px-6">
          {customers.map((customer, i) => {
            return (
              <div
                key={customer.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <Image
                    src={customer.image_url}
                    alt={`${customer.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white font-semibold md:text-base">
                      {customer.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {customer.phone}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
