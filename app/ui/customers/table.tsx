import Image from 'next/image';
import { UpdateCustomer, DeleteCustomer } from '@/app/ui/customers/buttons';
import { fetchFilteredCustomers } from '@/app/lib/data';

export default async function CustomersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const customers = await fetchFilteredCustomers(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {customers?.map((customer) => (
              <div
                key={customer.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <Image
                      src={customer.image_url || '/customers/default.png'}
                      alt={`${customer.name}'s profile picture`}
                      className="mr-2 rounded-full"
                      width={28}
                      height={28}
                    />
                    <p>{customer.name}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateCustomer id={customer.id} />
                    <DeleteCustomer id={customer.id} />
                  </div>
                </div>
                <div className="flex w-full items-center justify-between border-b py-5">
                  <div className="flex w-1/2 flex-col">
                    
                    <p className="font-medium">{customer.gender}</p>
                  </div>
                  <div className="flex w-1/2 flex-col">
                    
                    <p className="font-medium">{customer.poin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Phone
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Gender
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Poin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {customers?.map((customer) => (
                <tr key={customer.id}>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={customer.image_url || '/customers/default.png'}
                        className="rounded-full"
                        alt={`${customer.name}'s profile picture`}
                        width={28}
                        height={28}
                      />
                      <p>{customer.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-5 text-sm">
                    {customer.phone}
                  </td>
                  <td className="whitespace-nowrap px-4 py-5 text-sm">
                    {customer.gender}
                  </td>
                  <td className="whitespace-nowrap px-4 py-5 text-sm">
                    {customer.poin}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateCustomer id={customer.id} />
                      <DeleteCustomer id={customer.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
