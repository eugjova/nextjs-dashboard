export function SearchSkeleton() {
  return (
    <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
  );
}

export function InvoicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="h-96 w-full rounded-lg bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function CreateSkeleton() {
  return (
    <div className="h-10 w-[100px] rounded-lg bg-gray-200 animate-pulse" />
  );
}

export function ProductsTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="mb-2 w-full rounded-lg bg-gray-200 h-20 animate-pulse"
              />
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                {[...Array(6)].map((_, i) => (
                  <th key={i} scope="col" className="px-4 py-5">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-gray-50 p-4 animate-pulse"
          >
            <div className="flex p-4">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="ml-4 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <div className="h-[240px] bg-gray-200 rounded-lg animate-pulse" />
      </div>

      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <div className="space-y-4">
          <div className="h-8 w-36 bg-gray-200 rounded animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}