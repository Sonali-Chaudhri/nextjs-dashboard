'use client'


import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { createRole } from '@/app/lib/actions'; 
import Link from 'next/link';



export default function CreateRoleForm() {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!roleName || !description) {
      setError('Both fields are required.');
      return;
    }

    try {
      // Create a FormData object to send to the server
      const formData = new FormData();
      formData.append('name', roleName);
      formData.append('description', description);

      // Call the createRole function with the FormData
      await createRole(formData);
      setRoleName('');
      setDescription('');
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError('Failed to create role. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}  className="rounded-md bg-gray-50 p-4 md:p-6">
      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Role Name */}
      <div className="mb-4">
        <label htmlFor="roleName" className="mb-2 block text-sm font-medium">
          Role Name
        </label>
        <input
          id="roleName"
          name="roleName"
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Enter role name"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          required
        />
      </div>

      {/* Role Description */}
      <div className="mb-4">
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter role description"
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          rows={4}
        />
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
