import { CheckIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function CustomerStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-green-500 text-white': status === 'active',
          'bg-yellow-500 text-white': status === 'pending', // Example for pending status
          'bg-red-500 text-white': status === 'suspended',
          'bg-gray-100 text-gray-500': status === 'inactive', // You can keep this if needed
        }
      )}
    >
      {status === 'active' && (
        <>
          Active
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'pending' && (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'suspended' && (
        <>
          Suspended
          <XCircleIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'inactive' && (
        <>
          Inactive
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      )}
    </span>
  );
}
