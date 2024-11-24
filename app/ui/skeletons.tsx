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