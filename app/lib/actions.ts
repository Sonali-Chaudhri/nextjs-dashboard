"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from '@/app/auth';
import { AuthError } from 'next-auth';


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}



const RoleSchema = z.object({
  id: z.string(),

  name: z.string({
    invalid_type_error: "Role name is required.",
  }),

  description: z.string({
    invalid_type_error: "Description is required.",
  }),
});

const CreateRoleSchema = RoleSchema.omit({ id: true });

export type RoleState = {
  errors?: {
    name?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createRole(prevState: RoleState, formData: FormData) {
  const validatedFields = CreateRoleSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Role.",
    };
  }

  // Prepare data for insertion into the database
  const { name, description } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO role (name, description)
      VALUES (${name}, ${description})
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Role.",
    };
  }

  revalidatePath("/dashboard/roles");
  redirect("/dashboard/roles");
}


// Delete Role Function
export async function deleteRole(id: string) {
  try {
    await sql`DELETE FROM role WHERE id = ${id}`;
    revalidatePath("/dashboard/roles");
  } catch (error) {
    console.error("Error deleting role:", error);
    throw new Error("Failed to delete role.");
  }
}

const UpdateRole = RoleSchema.omit({ id: true }); // Assuming id is not updatable

// Update Role Function
export async function updateRole(
  id: string,
  prevState: RoleState,
  formData: FormData
) {
  // Validate the form data using Zod schema
  const validatedFields = UpdateRole.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  // If validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Role.",
    };
  }

  const { name, description } = validatedFields.data;

  try {
    await sql`
      UPDATE role
      SET name = ${name}, description = ${description}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error updating role:", error);
    return { message: "Database Error: Failed to Update Role." };
  }

  // Revalidate the cache and redirect to roles page
  revalidatePath("/dashboard/roles");
  redirect("/dashboard/roles");
}

//========Invoices
export type InvoiceState = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(
  prevState: InvoiceState,
  formData: FormData
) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

//update
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(
  id: string,
  prevState: InvoiceState,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}




const CustomerSchema = z.object({
  id: z.string({ invalid_type_error: "ID must be a string" }).optional(),
  name: z
    .string({ invalid_type_error: "Please provide a valid name" })
    .min(1, "Name is required"),
  email: z
    .string({ invalid_type_error: "Please provide a valid email address" })
    .email("Invalid email address"),
});

export type States = {
  errors?: {
    customerId?: string[];
    name?: string[];
    email?: string[];
  };
  message?: string | null;
};

// Create schema for customer creation (without ID)
const CreateCustomer = CustomerSchema.omit({ id: true });

export async function createCustomer(
  prevState: States,
  formData: FormData
): Promise<States> {
  // Validate form data using Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create customer.",
    };
  }

  // Retrieve validated data
  const { name, email } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO customer (name, email)
      VALUES (${name}, ${email})
    `;
  } catch (error) {
    console.error("Database error:", error); // Log the error for debugging
    return {
      message: "Database Error: Failed to Create Customer.",
      errors: { email: ["Email already exists."] }, // Adjust this message based on the error type if necessary
    };
  }

  // Revalidate the cache and redirect
  revalidatePath("/dashboard/customer");
  redirect("/dashboard/customer");
}

const UpdateCustomer = CustomerSchema.omit({ id: true });

// Function to update an existing customer
export async function updateCustomer(id: string, formData: FormData) {
  let name, email;

  // Validate and parse the form data
  try {
    ({ name, email } = UpdateCustomer.parse({
      name: formData.get("name"),
      email: formData.get("email"),
    }));
  } catch (validationError) {
    return { message: "Validation Error " };
  }

  // Update the customer in the database
  try {
    await sql`
      UPDATE customer
      SET name = ${name}, email = ${email}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Error updating customer:", error);
    return { message: "Database Error: Failed to Update Customer." };
  }

  // Revalidate and redirect
  revalidatePath("/dashboard/customer");
  redirect("/dashboard/customer");
}













// Function to delete a customer
export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customer WHERE id = ${id}`;
    revalidatePath("/dashboard/customer");
    return { message: "Deleted Customer!" };
  } catch (error) {
    return { message: "Database Error: Failed to Update Customer." };
  }
}
