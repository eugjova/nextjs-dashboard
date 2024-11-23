import Form from '@/app/ui/distributors/edit-form';
import Breadcrumbs from '@/app/ui/products/breadcrumbs';
import { fetchDistributorById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: any }) {
    const id = params.id;
    const [distributors] = await Promise.all([
        fetchDistributorById(id),
      ]);

      if (!distributors) {
        notFound();
      }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Distributor', href: '/dashboard/distributors' },
          {
            label: 'Edit Distributor',
            href: `/dashboard/distributors/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form distributors={distributors} />
    </main>
  );
}


