import Image from 'next/image';
// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/detailtransaksipembelian/buttons';
// import InvoiceStatus from '@/app/ui/detailtransaksipembelian/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { DetailTransaksiPembelian } from '@/app/lib/placeholder-data';
// import { fetchFilteredPenjualan } from '@/app/lib/data';

export default async function DetailPembelianTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // const detailtransaksipembelian = await fetchFilteredPenjualan(query, currentPage);

  return (
    // <div className="mt-6 flow-root">
    //   <div className="inline-block min-w-full align-middle">
    //     <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
    //       <div className="md:hidden">
    //         {detailtransaksipembelians?.map((detailtransaksipembelian) => (
    //           <div
    //             key={detailtransaksipembelian.id}
    //             className="mb-2 w-full rounded-md bg-white p-4"
    //           >
    //             <div className="flex items-center justify-between border-b pb-4">
    //               <div>
    //                 <div className="mb-2 flex items-center">
    //                   <Image
    //                     src={detailtransaksipembelian.image_url}
    //                     className="mr-2 rounded-full"
    //                     width={28}
    //                     height={28}
    //                     alt={`${detailtransaksipembelian.name}'s profile picture`}
    //                   />
    //                   <p>{detailtransaksipembelian.name}</p>
    //                 </div>
    //                 <p className="text-sm text-gray-500">{detailtransaksipembelian.email}</p>
    //               </div>
    //               <InvoiceStatus status={detailtransaksipembelian.status} />
    //             </div>
    //             <div className="flex w-full items-center justify-between pt-4">
    //               <div>
    //                 <p className="text-xl font-medium">
    //                   {formatCurrency(detailtransaksipembelian.amount)}
    //                 </p>
    //                 <p>{formatDateToLocal(detailtransaksipembelian.date)}</p>
    //               </div>
    //               <div className="flex justify-end gap-2">
    //                 <UpdateInvoice id={detailtransaksipembelian.id} />
    //                 <DeleteInvoice id={detailtransaksipembelian.id} />
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Pegawai
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Distributor
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Jumlah
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total
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
              {DetailTransaksiPembelian?.map((detailtransaksipembelian) => (
                <tr
                  key={detailtransaksipembelian.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {/* <Image
                        src={detailtransaksipembelian.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${detailtransaksipembelian.name}'s profile picture`}
                      /> */}
                      <p>{detailtransaksipembelian.id_pembelian}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detailtransaksipembelian.distributorId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {detailtransaksipembelian.id_jumlah}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(detailtransaksipembelian.id_total_biaya_transaksi)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(detailtransaksipembelian.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/* <UpdateInvoice id={detailtransaksipembelian.id} />
                      <DeleteInvoice id={detailtransaksipembelian.id} /> */}
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