// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100/0 p-0 shadow-sm`}
    >
      <div className="p-6 bg-black rounded shadow-sm">
        <div className="flex justify-between items-center space-x-4">
          <div>
            <div className="text-gray-400">
              <div className="h-5 w-20 rounded-md bg-gray-200" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              <div className="h-7 w-20 rounded-md bg-gray-200" />
            </div>
          </div>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 text-gray-400">
            <div className="h-8 w-8 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative flex w-full flex-col rounded-xl overflow-hidden md:col-span-4`}>

      <div className="rounded-xl bg-gray-950 p-4">
        <div className="mb-4 h-8 w-36 rounded-md bg-gray-100 shimmer" />
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-black p-4 md:gap-4 shimmer" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200 shimmer" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200 shimmer" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-gray-200 shimmer" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-gray-200 shimmer" />
          <div className="mt-2 h-4 w-12 rounded-md bg-gray-200 shimmer" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-gray-200 shimmer" />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="group block">
      <div>
        <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 bg-auto">
          {/* Placeholder shape for image */}
          <div className="h-52 w-52 bg-gray-300" />
        </div>
        <div className="bg-black p-2 rounded-b-lg">
          {/* Placeholder shapes for text content */}
          <div className="h-5 w-40 rounded-md bg-gray-200 mb-4" />
          <div className="h-4 w-32 rounded-md bg-gray-200 mb-2" />
          <div className="h-4 w-24 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function ServicesSkeleton() {
  return (
    <div className="group block">
      <div>
        <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 bg-auto">
          {/* Placeholder shape for image */}
          <div className="h-52 w-52 bg-gray-300" />
        </div>
        <div className="bg-black p-2 rounded-b-lg">
          {/* Placeholder shapes for text content */}
          <div className="h-5 w-40 rounded-md bg-gray-200 mb-4" />
          <div className="h-4 w-32 rounded-md bg-gray-200 mb-2" />
          <div className="h-4 w-24 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col rounded-xl overflow-hidden md:col-span-4`}
    >
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-950 p-4">
        <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
        <div className="bg-black px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <div className="flex items-center pb-2 pt-6">
            <div className="h-5 w-5 rounded-full bg-gray-200" />
            <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <div className="md:col-span-4 lg:col-span-8">
          <RevenueChartSkeleton />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <LatestInvoicesSkeleton />
        <LatestInvoicesSkeleton />
      </div>
    </>
  );
}

export function InvoicePageSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mt-2 mb-9 h-12 w-48 overflow-hidden rounded-md bg-gray-100`}
      />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-2">
        <SearchSkeleton />
        <CreateSkeleton />
      </div>
      <InvoicesTableSkeleton />
    </>
  );
}

export function CustomerPageSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mt-2 mb-9 h-12 w-48 overflow-hidden rounded-md bg-gray-300`}
      />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-2">
        <SearchSkeleton />
        <CreateSkeleton />
      </div>
      <CustomersTableSkeleton />
    </>
  );
}

export function ProductPageSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mt-2 mb-9 h-12 w-48 overflow-hidden rounded-md bg-gray-300`}
      />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-2">
        <SearchSkeleton />
        <CreateSkeleton />
      </div>
      <ProductsTableSkeleton />
    </>
  );
}

export function ServicesPageSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mt-2 mb-9 h-12 w-48 overflow-hidden rounded-md bg-gray-300`}
      />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-2">
        <SearchSkeleton />
        <CreateSkeleton />
      </div>
      <ServicesTableSkeleton />
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Product */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Quantity */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Date */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Status */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function CustomerTableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Product */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Quantity */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function ServiceTableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* No */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-8 w-8 rounded bg-gray-100"></div>
      </td>
      {/* Service */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Price */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Estimation */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function InvoicesMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export function InvoicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className={`${shimmer} relative overflow-hidden rounded-lg bg-gray-950 p-2 md:pt-0`}>
          <div className="md:hidden">
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-white md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Product
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Quantity
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-950">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function CustomersTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className={`${shimmer} relative overflow-hidden rounded-lg bg-gray-950 p-2 md:pt-0`}>
          <div className="md:hidden">
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-white md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Invoices
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Pending
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Paid
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-950">
              <CustomerTableRowSkeleton />
              <CustomerTableRowSkeleton />
              <CustomerTableRowSkeleton />
              <CustomerTableRowSkeleton />
              <CustomerTableRowSkeleton />
              <CustomerTableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ProductsTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className={`${shimmer} relative overflow-hidden grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-x-8`}>
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
      </div>
    </div>
  );
}

export function ServicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className={`${shimmer} relative overflow-hidden rounded-lg bg-gray-950 p-2 md:pt-0`}>
          <div className="md:hidden">
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-white md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  No
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Service
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Estimation
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-950">
              <ServiceTableRowSkeleton />
              <ServiceTableRowSkeleton />
              <ServiceTableRowSkeleton />
              <ServiceTableRowSkeleton />
              <ServiceTableRowSkeleton />
              <ServiceTableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden block w-full rounded-md bg-gray-100/0 p-0 shadow-sm`}>
      <div className="peer block w-full rounded-md border bg-gray-500 py-[17px] pl-10 text-sm">
      </div>
    </div>
  );
}

export function CreateSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden block w-48 rounded-md bg-gray-100/0 p-0 shadow-sm`}>
      <div className={`${shimmer} peer block w-48 rounded-md border bg-gray-400 py-[17px] pl-10 text-sm`}>
      </div>
    </div>

  );
}