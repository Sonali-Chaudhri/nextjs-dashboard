// app/api/roles/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  // Mock data or fetch data from your database
  const roles = [
    { id: 1, roleName: 'Admin', description: 'Administrator role', status: 'Active', createdDate: '2024-10-01' },
    { id: 2, roleName: 'User', description: 'Standard user role', status: 'Inactive', createdDate: '2024-10-02' }
  ];

  // Filter roles based on the query parameter
  const filteredRoles = roles.filter(role =>
    role.roleName.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json(filteredRoles);
}

// Mock database or data source (for demonstration)
const roles = [
  { id: '1', roleName: 'Admin', description: 'Administrator role', status: 'Active', createdDate: '2024-10-01' },
  { id: '2', roleName: 'User', description: 'Standard user role', status: 'Inactive', createdDate: '2024-10-02' }
];

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Implement your deletion logic here
  const roleIndex = roles.findIndex(role => role.id === id);

  if (roleIndex > -1) {
    roles.splice(roleIndex, 1); // Remove the role from the mock data
    return NextResponse.json({ message: 'Role deleted successfully' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Role not found' }, { status: 404 });
  }
}
