import { sql } from "@vercel/postgres";
import {
  CustomerField,
  CustomerForm,
  CustomerTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  
  RoleField,
  RoleForm,
} from "./definitions";
import { formatCurrency } from "./utils";
// import { CustomerForm } from '@/app/lib/definitions

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log("Data fetch completed after 3 seconds.");

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? "0");
    const numberOfCustomers = Number(data[1].rows[0].count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? "0");

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 3;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}





//s
export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

//do like this fetchlatestinvoices

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM customer
      WHERE
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE); // Adjusted to count[0]
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of customers.");
  }
}

     



export async function fetchCustomerById(id: string) {
  try {
    const data = await sql<CustomerForm>`
      SELECT
        customer.id,
        customer.name,
        customer.email
      FROM customer
      WHERE customer.id = ${id}; 
    `;

    const customer = data.rows[0]; // Get the first customer from the result
    return customer || null; // Return null if no customer found
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customer.");
  }
}




export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}




/// customer
export async function fetchCustomer() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customer
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customer.");
  }
}

//customer


export async function fetchCustomerPages(query: string) {
  try {
    console.log("Search query:", query);

    const countResult = await sql`
      SELECT COUNT(*)
      FROM customer
      WHERE
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`}
    `;

    // Calculate the total pages based on the count
    const totalPages = Math.ceil(Number(countResult.rows[0].count) / ITEMS_PER_PAGE);
    
    return totalPages; 
  } catch (error) {
    console.error("Database Error:", error); // Log the error message
    throw new Error("Failed to fetch total number of customers.");
  }
}





export async function fetchFilteredCustomer(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const customers = await sql`
      SELECT
        customer.id,
        customer.name,
        customer.email
      FROM customer
      WHERE
        customer.name ILIKE ${`%${query}%`} OR
        customer.email ILIKE ${`%${query}%`}
      ORDER BY customer.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return customers.rows; // Return the paginated rows of customers
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customers.");
  }
}






// Fetch role by ID
// Define the Role type based on your database schema
export type Role = {
  id: string;
  name: string;
  description?: string;
};
export async function fetchRoleById(id: string) {
  try {
    const data = await sql<RoleForm>`
      SELECT
        role.id,
        role.name,
        role.description
      FROM role
      WHERE role.id = ${id};
    `;

    const role = data.rows.map((role) => ({
      ...role,
    }));

    return role[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch role.');
  }
}


// Create a new role

export async function createRole(role: RoleField) {
  try {
    const { name, description } = role;

    // Insert the role into the roles table
    await sql`
      INSERT INTO role (name, description) 
      VALUES (${name}, ${description})
    `;

    // Optionally, retrieve the newly created role
    const createdRole = await sql`
      SELECT * FROM role 
      WHERE name = ${name} AND description = ${description} 
      ORDER BY id DESC LIMIT 1
    `;

    return createdRole.rows[0]; // Return the newly created role
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create role.");
  }
}


// Fetch all roles   //check on db qury

export async function fetchRoles() {
  try {
    const data = await sql`
      SELECT role.id, role.name, role.description
      FROM role
      ORDER BY role.name ASC
    `;

    const roles = data.rows.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
    }));

    return roles;
  } catch (error) {
    console.error("Database Error:", error); // Log the error
    throw new Error("Failed to fetch roles.");
  }
}

//pagination
export async function fetchRolesPages(query: string) {
  try {
    console.log("Search query:", query);

    const count = await sql`SELECT COUNT(*)
      FROM role
      WHERE
        name ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error); // Log the error message
    throw new Error("Failed to fetch total number of roles.");
  }
}
// const ITEMS_PER_PAGE = 6;

export async function fetchFilteredRoles(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const roles = await sql`
      SELECT
        role.id,
        role.name,
        role.description
      FROM role
      WHERE
        role.name ILIKE ${`%${query}%`} OR
        role.description ILIKE ${`%${query}%`}
      ORDER BY role.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return roles.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch roles.");
  }
}

async function testDbConnection() {
  try {
    await sql`SELECT 1`; // Simple query to test the connection
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

testDbConnection();
