import Pagination from '@/app/ui/customer/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/customer/table';
import { CreateCustomer } from '@/app/ui/customer/buttons';
import { lusitana } from '@/app/ui/fonts';
import { CustomerTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchCustomerPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  // Await searchParams to extract query and page
  const searchParams = await props.searchParams;
  const query = searchParams?.query || ''; // Get search query
  const currentPage = Number(searchParams?.page) || 1; // Get current page number

  // Fetch total pages based on the search query
  const totalPages = await fetchCustomerPages(query);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>

      {/* Search and Create Customer Section */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." /> {/* Search component for customers */}
        <CreateCustomer /> {/* Button to create a new customer */}
      </div>

      {/* Customers Table Section */}
      <Suspense key={query + currentPage} fallback={<CustomerTableSkeleton />}>
        <Table query={query} currentPage={currentPage} /> 
      </Suspense>

      {/* Pagination Section */}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
