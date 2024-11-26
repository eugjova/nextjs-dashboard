export default function DistributorsTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <div className="mb-2 w-full rounded-md bg-white p-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="ml-4 space-y-2">
                    <div className="h-5 w-40 rounded bg-gray-200" />
                    <div className="h-4 w-24 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between pt-4">
                <div>
                  <div className="h-5 w-32 rounded bg-gray-200" />
                </div>
                <div className="flex justify-end gap-2">
                  <div className="h-10 w-10 rounded bg-gray-200" />
                  <div className="h-10 w-10 rounded bg-gray-200" />
                </div>
              </div>
            </div>
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
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="w-full border-b py-3 text-sm last-of-type:border-none">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="h-6 w-32 rounded bg-gray-200" />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="h-6 w-24 rounded bg-gray-200" />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <div className="h-10 w-10 rounded bg-gray-200" />
                      <div className="h-10 w-10 rounded bg-gray-200" />
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