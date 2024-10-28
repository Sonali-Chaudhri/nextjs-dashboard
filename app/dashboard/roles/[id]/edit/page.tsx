import Form from "@/app/ui/roles/editrole"; // Adjust the import path according to your file structure
import Breadcrumbs from "@/app/ui/roles/breadcrumbs"; // Adjust the import path accordingly
import { fetchRoleById, fetchRoles } from "@/app/lib/data"; // Ensure you have these functions in your data layer
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Role",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [role] = await Promise.all([
    fetchRoleById(id),
  ]);

  if (!role) {
    notFound();
  }

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
      <Form role={role} /> {/* Pass the role data to the Form */}
    </main>
  );
}
