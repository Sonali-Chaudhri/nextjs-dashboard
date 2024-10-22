'use client';

import { Role } from '@/app/lib/definitions';
import { CheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import  {updateRole}from "@/app/lib/actions" // Ensure this is the correct function you're importing.

export default function EditRoleForm({ role }: { role: Role }) {

  // Fix the bind method with UpdateRole
  const updateRoleById = updateRole.bind(null, role.id);

  return (
    <form action={updateRoleById} className="space-y-6 bg-white p-6 shadow-md rounded-lg">
      {/* Role Name */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
          Role Name
        </label>
        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={role.name}
            placeholder="Enter role name"
            className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
          />
          <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Role Description */}
      <div className="mb-4">
        <label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={role.description}
          placeholder="Enter role description"
          className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between space-x-4">
        <Link
          href="/dashboard/roles"
          className="flex items-center justify-center h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </Link>
        <Button type="submit" className="flex items-center justify-center h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <CheckIcon className="mr-2 h-4 w-4" />
          Edit Role
        </Button>
      </div>
    </form>
  );
}