import { CheckIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function RoleStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-green-500 text-white': status === 'active',
          'bg-gray-100 text-gray-500': status === 'inactive',
          'bg-red-500 text-white': status === 'archived',
        }
      )}
    >
      {status === 'active' && (
        <>
          Active
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'inactive' && (
        <>
          Inactive
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      )}
      {status === 'archived' && (
        <>
          Archived
          <XCircleIcon className="ml-1 w-4 text-white" />
        </>
      )}
    </span>
  );
}
