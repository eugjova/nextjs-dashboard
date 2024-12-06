import { UpdatePegawai, DeletePegawai } from '@/app/ui/pegawai/buttons';
import { fetchFilteredPegawai } from '@/app/lib/data';
import Pagination from '@/app/ui/pegawai/pagination';

export default async function PegawaiTable({
  query,
  currentPage,
  totalPages,
}: {
  query: string;
  currentPage: number;
  totalPages: number;
}) {
  const pegawai = await fetchFilteredPegawai(query, currentPage);
  
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <table className="min-w-full rounded-md text-gray-900">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-5 font-medium">Phone</th>
                    <th scope="col" className="px-3 py-5 font-medium">Gender</th>
                    <th scope="col" className="px-3 py-5 font-medium">Email</th>
                    <th scope="col" className="px-3 py-5 font-medium">Role</th>
                    <th scope="col" className="px-3 py-5 font-medium">Password</th>
                    <th scope="col" className="px-3 py-5 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white text-gray-900">
                  {pegawai.map((pegawai) => (
                    <tr key={pegawai.id} className="group">
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
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
                        {pegawai.role_name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {'•'.repeat(10)}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-center gap-3">
                          <UpdatePegawai pegawai={pegawai} />
                          <DeletePegawai id={pegawai.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
