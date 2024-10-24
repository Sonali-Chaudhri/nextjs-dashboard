import CreateCustomerForm from '@/app/ui/customer/create'; // Adjust the path as needed
import Breadcrumbs from '@/app/ui/customer/breadcrumbs'; // Adjust the path for breadcrumbs



export default function CreateCustomerPage() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customer', href: '/dashboard/customer' },
          { label: 'Create Customer', href: '/dashboard/customer/create', active: true },
        ]}
      />
      <CreateCustomerForm/>
    </main>
  );
}
