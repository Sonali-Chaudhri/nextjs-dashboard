"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//role

const RoleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});



const CreateRole = RoleSchema.omit({ id: true }); 

export async function createRole(formData: FormData) {
  console.log(formData);

  const { name, description } = CreateRole.parse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  await sql`
    INSERT INTO role (name, description)
    VALUES (${name}, ${description})
  `;

  revalidatePath("/dashboard/roles");
  redirect("/dashboard/roles"); 
}

export async function deleteRole(id: string) {
  try {
    await sql`DELETE FROM role WHERE id = ${id}`;
    revalidatePath("/dashboard/roles"); // Revalidate the roles path to refresh the data
  } catch (error) {
    console.error("Error deleting role:", error);
    throw new Error("Failed to delete role."); // Optional: throw an error to be handled in the UI
  }
}

// Zod schema for validating the form data
const FormSchemas = z.object({
  id: z.string(),
  roleName: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
});


// Update Role Function
export async function updateRole(id: string, formData: FormData) {

 const updateRoleSchema = FormSchemas.omit({ id: true });

  const { roleName, description } = updateRoleSchema.parse({
    roleName: formData.get("name"),
    description: formData.get("description"),
  });

  // Debugging logs to ensure proper form data is received
  console.log(`
    UPDATE role
    SET name = ${roleName}, description = ${description}
    WHERE id = ${id}
  `);

  // Execute the SQL query to update the role
  await sql`
    UPDATE role
    SET name = ${roleName}, description = ${description}
    WHERE id = ${id}
  `;

  // Revalidate the path and redirect to the roles dashboard
  revalidatePath("/dashboard/roles");
  redirect("/dashboard/roles");
}

//========Invoices
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});
const CreateInvoice = FormSchema.omit({ id: true, date: true });


export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  // Test it out:
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date) 
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
