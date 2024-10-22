import CreateRoleForm from '@/app/ui/roles/create-role-form';
import Breadcrumbs from '@/app/ui/roles/breadcrumbs';
import { fetchRoles } from '@/app/lib/data';

export default async function Page() {
  let roles = [];

  try {
    roles = await fetchRoles();
  } catch (error) {
    console.error('Error fetching roles:', error);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Roles', href: '/dashboard/roles' },
          {
            label: 'Create Role',
            href: '/dashboard/roles/create',
            active: true,
          },
        ]}
      />
      <CreateRoleForm/>
    </main>
  );
}
