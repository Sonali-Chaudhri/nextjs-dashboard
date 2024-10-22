// // app/ui/roles/DeleteRole.tsx
// 'use client';

// import { useState } from 'react';

// export function DeleteRole({ id }: { id: string }) {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleDelete = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsDeleting(true);

//     try {
//       const response = await fetch(`/api/role/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         console.log('Role deleted successfully');
//       } else {
//         console.error('Failed to delete role');
//       }
//     } catch (error) {
//       console.error('Error deleting role:', error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleDelete}>
//       <button type="submit" className="rounded-md border p-2 hover:bg-gray-100" disabled={isDeleting}>
//         <span className="sr-only">Delete</span>
//         🗑️ {/* Emoji representing trash can */}
//       </button>
//     </form>
//   );
// }
