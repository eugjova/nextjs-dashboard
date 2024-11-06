import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
// import { UpdateCustomer, DeleteCustomer } from '@/app/ui/pegawai/buttons';
// import { fetchFilteredCustomers } from '@/app/lib/data';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { pegawai } from '@/app/lib/placeholder-data';

export default async function PegawaiTable({
  query,
  currentPage
}: {
  query: string;
  currentPage: number;
}) {
  // const pegawai = await fetchFilteredCustomers(query, currentPage);
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {pegawai?.map((pegawai) => (
                  <div
                    key={pegawai.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            {/* <Image
                              src={pegawai.image_url}
                              className="rounded-full"
                              alt={`${pegawai.name}'s profile picture`}
                              width={28}
                              height={28}
                            /> */}
                            <p>{pegawai.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {pegawai.phone}
                        </p>
                      </div>
                      <div className="flex w-full items-center justify-between pt-4">
                  <div>
                  </div>
                  <div className="flex justify-end gap-2">
                    {/* <UpdateCustomer id={pegawai.id} />
                    <DeleteCustomer id={pegawai.id} /> */}
                  </div>
                </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Pending</p>
                        <p className="font-medium">{pegawai.gender}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Paid</p>
                        <p className="font-medium">{pegawai.email}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Paid</p>
                        <p className="font-medium">{pegawai.password}</p>
                      </div>
                    </div>
                    {/* <div className="pt-4 text-sm">
                      <p>{pegawai.total_invoices} invoices</p>
                    </div> */}
                   </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table ">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6  ">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Gender
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Password
                    </th>
                  </tr>
                </thead>
 
                <tbody className="divide-y divide-white text-gray-900 ">
                  {pegawai.map((pegawai) => (
                    <tr key={pegawai.id} className="group">
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6 ">
                        <div className="flex items-center gap-3">
                          {/* <Image
                            src={pegawai.image_url}
                            className="rounded-full"
                            alt={`${pegawai.name}'s profile picture`}
                            width={28}
                            height={28}
                          /> */}
                          <p>{pegawai.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {pegawai.phone}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {pegawai.gender}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {pegawai.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {pegawai.password}
                      </td>
                      {/* <td className="whitespace-nowrap px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {pegawai.total_paid}
                      </td> */}
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        {/* <div className="flex justify-end gap-3">
                          <UpdateCustomer id={pegawai.id} />
                          <DeleteCustomer id={pegawai.id} />
                        </div> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
