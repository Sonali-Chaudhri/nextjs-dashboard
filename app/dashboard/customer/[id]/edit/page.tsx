// /app/dashboard/customers/[id]/edit/page.tsx

import Form from '@/app/ui/customer/edit'; // Adjust the path for your edit customer form
import Breadcrumbs from '@/app/ui/customer/breadcrumbs'; // Adjust the path for your breadcrumbs
import { fetchCustomerById } from '@/app/lib/data'; // Adjust to your data fetching functions
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Customer',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const customer = await fetchCustomerById(id); // Fetch customer by ID

  if (!customer) {
    notFound(); // Redirect to 404 if the customer is not found
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Edit Customer',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form customer={customer} /> {/* Pass the customer data to the form */}
    </main>
  );
}
