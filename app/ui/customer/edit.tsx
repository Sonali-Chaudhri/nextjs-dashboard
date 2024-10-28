'use client';

import { Customer } from '@/app/lib/definitions'; // Adjust the import according to your definitions file
import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateCustomer } from '@/app/lib/actions'; // Ensure this is the correct function you're importing.

export default function EditCustomerForm({ customer }: { customer: Customer }) {

  // Fix the bind method with updateCustomer
  const updateCustomerById = updateCustomer.bind(null, customer.id);

  return (
    <form action={updateCustomerById} className="space-y-6 bg-white p-6 shadow-md rounded-lg">
      {/* Customer Name */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
          Customer Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={customer.name}
          placeholder="Enter customer name"
          className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
          required
        />
      </div>

      {/* Customer Email */}
      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={customer.email}
          placeholder="Enter customer email"
          className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between space-x-4">
        <Link
          href="/dashboard/customer"
          className="flex items-center justify-center h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </Link>
        <Button type="submit" className="flex items-center justify-center h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <CheckIcon className="mr-2 h-4 w-4" />
          Edit Customer
        </Button>
      </div>
    </form>
  );
}
