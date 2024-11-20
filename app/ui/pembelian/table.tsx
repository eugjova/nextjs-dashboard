import Image from 'next/image';
// import InvoiceStatus from '@/app/ui/pembelian/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { pembelian } from '@/app/lib/placeholder-data';
// import { fetchFilteredPenjualan } from '@/app/lib/data';

export default async function PembelianTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // const pembelian = await fetchFilteredPenjualan(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {pembelian?.map((pembelian) => (
              <div
                key={pembelian.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{pembelian.id_pegawai}</p>
                    </div>
                    <p className="text-sm text-gray-500">{pembelian.id_distributor}</p>
                    <p className="text-sm text-gray-500">{pembelian.jumlah}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(pembelian.total)}
                    </p>
                    <p>{formatDateToLocal(pembelian.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Pegawai
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
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
              {pembelian?.map((pembelian) => (
                <tr
                  key={pembelian.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{pembelian.id_pegawai}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {pembelian.id_distributor}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {pembelian.jumlah}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(pembelian.total)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(pembelian.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {/* <div className="flex justify-end gap-3">
                      <UpdateInvoice id={pembelian.id} />
                      <DeleteInvoice id={pembelian.id} />
                    </div> */}
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
