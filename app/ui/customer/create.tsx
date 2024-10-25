'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { createCustomer } from '@/app/lib/actions'; 
import Link from 'next/link';

export default function CreateCustomerForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email) {
      setError('Both fields are required.');
      return;
    }

    try {
      // Create a FormData object to send to the server
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);

      // Call the createCustomer function with the FormData
      await createCustomer(formData);
      setName('');
      setEmail('');
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError('Failed to create customer. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-md bg-gray-50 p-4 md:p-6">
      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Customer Name */}
      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter customer name"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          required
          
        />
      </div>

      {/* Customer Email */}
      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter customer email"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          required
        />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customer"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}
