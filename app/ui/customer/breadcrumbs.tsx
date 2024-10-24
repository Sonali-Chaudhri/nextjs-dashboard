import { clsx } from 'clsx';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts'; // Ensure this import is correct

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function CustomerBreadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={clsx(lusitana.className, 'flex text-xl md:text-2xl')}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active ? 'page' : undefined}
            className={clsx(
              breadcrumb.active ? 'text-gray-900' : 'text-gray-500',
              'flex items-center'
            )}
          >
            <Link href={breadcrumb.href} className="hover:underline">
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
