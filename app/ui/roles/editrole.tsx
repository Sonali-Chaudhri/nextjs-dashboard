"use client";

import { RoleForm } from "@/app/lib/definitions";
import { UserCircleIcon, PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateRole, RoleState } from "@/app/lib/actions";
import { useActionState } from "react";

export default function EditRoleForm({ role }: { role: RoleForm }) {
  const initialState: RoleState = { message: null, errors: {} };

  // Check if role and its ID are defined
  if (!role || !role.id) {
    console.error("Role or Role ID is undefined");
    return null; // Return null or an error message
  }

  // Bind the updateRole function with the role ID
  const updateRoleWithId = updateRole.bind(null, role.id);
  const [state, formAction] = useActionState(updateRoleWithId, initialState);

  return (
    <form action={formAction} method="POST" className="space-y-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Role Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Role Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={role.name}
              placeholder="Enter role name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="roleName-error"
              required
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="roleName-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Role Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="description"
              name="description"
              type="text"
              defaultValue={role.description}
              placeholder="Enter role description"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="description-error"
              required
            />
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Form Submission Feedback */}
        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/roles"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Role</Button>
      </div>
    </form>
  );
}
