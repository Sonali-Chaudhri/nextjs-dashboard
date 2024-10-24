import Pagination from "@/app/ui/customer/pagination"; // Adjust path for Customer pagination
import Search from "@/app/ui/search"; // Keep using the same Search component
import { CreateCustomer } from "@/app/ui/customer/buttons"; // Adjust path for CreateCustomer button
import { lusitana } from "@/app/ui/fonts"; // Keep using the same font
import Table from "@/app/ui/customer/table"; // Adjust path for Customer table
import { CustomerTableSkeleton } from "@/app/ui/skeletons"; // Adjust path for Customer skeleton
import { Suspense } from "react";
import { fetchCustomerPages } from "@/app/lib/data"; // Adjust to fetch customers

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || ""; // Get search query
  const currentPage = Number(searchParams?.page) || 1; // Get current page number
  const totalPages = await fetchCustomerPages(query); // Fetch customers and total pages

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customer</h1>
      </div>

      {/* Search and Create Customer Section */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." /> {/* Search component for customers */}
        <CreateCustomer /> {/* Button to create a new customer */}
      </div>

      {/* Customers Table Section */}
      <Suspense key={query + currentPage} fallback={<CustomerTableSkeleton />}>
        <Table query={query} currentPage={currentPage} /> {/* Table component for customers */}
      </Suspense>

      {/* Pagination Section */}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} /> {/* Pagination for customers */}
      </div>
    </div>
  );
}
