import Form from '@/app/ui/pegawai/edit-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { fetchCustomers, fetchPegawaiById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Edit Pegawai',
};
 
export default async function Page({ params }: { params: any }) {
    const id = params.id;
    const [ pegawai ] = await Promise.all([
        fetchPegawaiById(id),
      ]);
 
      if (!pegawai) {
        notFound();
      }
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pegawai', href: '/dashboard/pegawai' },
          {
            label: 'Edit Pegawai',
            href: `/dashboard/pegawai/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form pegawai={pegawai}/>
    </main>
  );
}