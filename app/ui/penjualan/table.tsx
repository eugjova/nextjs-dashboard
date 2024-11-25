import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/penjualan/buttons';
import InvoiceStatus from '@/app/ui/penjualan/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { penjualan } from '@/app/lib/placeholder-data';
// import { fetchFilteredPenjualan } from '@/app/lib/data';

export default async function PenjualanTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // const penjualans = await fetchFilteredPenjualan(query, currentPage);

  return (
    // <div className="mt-6 flow-root">
    //   <div className="inline-block min-w-full align-middle">
    //     <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
    //       <div className="md:hidden">
    //         {penjualans?.map((penjualan) => (
    //           <div
    //             key={penjualan.id}
    //             className="mb-2 w-full rounded-md bg-white p-4"
    //           >
    //             <div className="flex items-center justify-between border-b pb-4">
    //               <div>
    //                 <div className="mb-2 flex items-center">
    //                   <Image
    //                     src={penjualan.image_url}
    //                     className="mr-2 rounded-full"
    //                     width={28}
    //                     height={28}
    //                     alt={`${penjualan.name}'s profile picture`}
    //                   />
    //                   <p>{penjualan.name}</p>
    //                 </div>
    //                 <p className="text-sm text-gray-500">{penjualan.email}</p>
    //               </div>
    //               <InvoiceStatus status={penjualan.status} />
    //             </div>
    //             <div className="flex w-full items-center justify-between pt-4">
    //               <div>
    //                 <p className="text-xl font-medium">
    //                   {formatCurrency(penjualan.amount)}
    //                 </p>
    //                 <p>{formatDateToLocal(penjualan.date)}</p>
    //               </div>
    //               <div className="flex justify-end gap-2">
    //                 <UpdateInvoice id={penjualan.id} />
    //                 <DeleteInvoice id={penjualan.id} />
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Jumlah
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Poin
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {penjualan?.map((penjualan) => (
                <tr
                  key={penjualan.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {/* <Image
                        src={penjualan.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${penjualan.name}'s profile picture`}
                      /> */}
                      <p>{penjualan.id_produk}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {penjualan.jumlah}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(penjualan.total)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {penjualan.poin}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(penjualan.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={penjualan.id} />
                      <DeleteInvoice id={penjualan.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    //     </div>
    //   </div>
    // </div>
  );
}
