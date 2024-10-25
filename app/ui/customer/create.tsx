'use client';

import { Button } from '@/app/ui/button';
import { createCustomer, States } from '@/app/lib/actions';
import { useActionState } from 'react';
import Link from 'next/link';

export default function CreateCustomerForm() {
  const initialState: States = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCustomer, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customerName" className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <input
            id="customerName"
            name="name"
            type="text"
            placeholder="Enter customer name"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="customerName-error"
            required
          />
          <div id="customerName-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="customerEmail" className="mb-2 block text-sm font-medium">
            Customer Email
          </label>
          <input
            id="customerEmail"
            name="email"
            type="email"
            placeholder="Enter customer email"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="customerEmail-error"
            required
          />
          <div id="customerEmail-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}
