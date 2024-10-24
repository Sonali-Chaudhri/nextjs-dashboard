import CreateCustomerForm from '@/app/ui/customer/create'; // Adjust the path to your form component
import Breadcrumbs from '@/app/ui/customer/breadcrumbs'; // Adjust the path to your breadcrumbs component
import { fetchCustomers} from '@/app/lib/data'; // Ensure this function is implemented to fetch customers

export default async function Page() {
  // Fetch existing customers, if needed for some functionality (e.g., a dropdown)
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <CreateCustomerForm /> {/* Pass customers if needed for any purpose */}
    </main>
  );
}
