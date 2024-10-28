import CreateRoleForm from "@/app/ui/roles/create-role-form"; // Adjust the path to your role form component
import Breadcrumbs from "@/app/ui/roles/breadcrumbs"; // Adjust the path to your breadcrumbs component
import { fetchRoles } from "@/app/lib/data"; // Ensure this function is implemented to fetch existing roles, if needed

export default async function Page() {
  // Fetch existing roles, if needed for some functionality (e.g., a dropdown)
  const roles = await fetchRoles();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Roles", href: "/dashboard/roles" },
          {
            label: "Create Role",
            href: "/dashboard/roles/create",
            active: true,
          },
        ]}
      />
      <CreateRoleForm /> {/* Pass roles if needed for any purpose */}
    </main>
  );
}
