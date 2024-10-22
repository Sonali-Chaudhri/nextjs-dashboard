import Form from "@/app/ui/roles/editrole";
import Breadcrumbs from "@/app/ui/roles/breadcrumbs";
import { fetchRoleById } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [role] = await Promise.all([
    fetchRoleById(id),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Roles", href: "/dashboard/roles" },
          {
            label: "Edit Role",
            href: `/dashboard/roles/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form role={role}/>
    </main>
  );
}
