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
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};



const FormSchema = z.object({
  id: z.string(),
  
  customerId: z.string().nonempty({ message: 'Please select a customer.' }),

  amount: z.coerce.number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),

  status: z.enum(["pending", "paid"], { 
    invalid_type_error: 'Please select an invoice status.' 
  }),

  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });


export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: String(formData.get('customerId')) || '', // Convert to string, default to empty string
    amount: Number(formData.get('amount')) || 0,          // Convert to number, default to 0
    status: String(formData.get('status')) || '',          // Convert to string, default to empty string
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}













//update
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {


  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}







 

const CustomerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

const CreateCustomer = CustomerSchema.omit({ id: true });

export async function createCustomer(formData: FormData) {
  console.log(formData);

  const { name, email } = CreateCustomer.parse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  await sql`
    INSERT INTO customer (name, email)
    VALUES (${name}, ${email})
  `;

  revalidatePath("/dashboard/customer");
  redirect("/dashboard/customer");
}





const UpdateCustomer = CustomerSchema.omit({ id: true });

// Function to update an existing customer
export async function updateCustomer(id: string, formData: FormData) {
  const { name, email } = UpdateCustomer.parse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  await sql`
    UPDATE customer
    SET name = ${name}, email = ${email}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/customer–");
  redirect("/dashboard/customer");
}

// Function to delete a customer
export async function deleteCustomer(id: string) {
  await sql`DELETE FROM customer WHERE id = ${id}`;
  revalidatePath("/dashboard/customer");
}
