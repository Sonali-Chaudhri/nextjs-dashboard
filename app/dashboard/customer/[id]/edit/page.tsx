import Form from "@/app/ui/customer/edit"; // Adjust the path for your edit customer form
import Breadcrumbs from "@/app/ui/customer/breadcrumbs"; // Adjust the path for your breadcrumbs
import { fetchCustomerById } from "@/app/lib/data"; // Adjust to your data fetching function
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [customer] = await Promise.all([
    fetchCustomerById(id), // Fetch the customer by ID
  ]);
  if (!customer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customer", href: "/dashboard/customer" },
          {
            label: "Edit Customer",
            href: `/dashboard/customer/${id}/edit`, // Active link for the current edit page
            active: true,
          },
        ]}
      />
      <Form customer={customer} />{" "}
      {/* Pass the fetched customer data to the form */}
    </main>
  );
}
