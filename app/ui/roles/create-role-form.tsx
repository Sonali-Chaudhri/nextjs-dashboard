"use client";

import { useActionState } from "react";
import { Button } from "@/app/ui/button";
import { createRole, RoleState } from "@/app/lib/actions"; // Ensure that your createRole function and RoleState type are properly defined
import Link from "next/link";

export default function CreateRoleForm() {
  const initialState: RoleState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createRole, initialState);

  return (
    <form action={formAction} className="rounded-md bg-gray-50 p-4 md:p-6">
      <h2 className="sr-only">Create Role Form</h2>
      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}
      </div>

      {/* Role Name */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Role Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter role name"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby="role-name-description"
          required
        />

        <div id="role-name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name &&
            state.errors.name.map((error: string) => (
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
        <textarea
          id="description"
          name="description"
          placeholder="Enter role description"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          rows={4}
          aria-describedby="description-help"
          required
        />

        <div id="description-error" aria-live="polite" aria-atomic="true">
          {state.errors?.description &&
            state.errors.description.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/roles"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Role</Button>
      </div>
    </form>
  );
}
