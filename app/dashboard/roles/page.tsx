import Pagination from "@/app/ui/roles/pagination";
import Search from "@/app/ui/search";
import { CreateRole } from "@/app/ui/roles/buttons";
import { lusitana } from "@/app/ui/fonts";
import Table from "@/app/ui/roles/table";
import { RolesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

import { fetchRolesPages } from "@/app/lib/data";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchRolesPages(query);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Roles</h1>
      </div>

      {/* Search and Create Role Section */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search roles..." />
        <CreateRole />
      </div>

      {/* Roles Table Section */}
      <Suspense key={query + currentPage} fallback={<RolesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>

      {/* Pagination Section */}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
