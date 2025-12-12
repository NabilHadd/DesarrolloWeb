import Link from 'next/link';
import { ReactNode } from 'react';

interface LinkToDetailProps {
  itemId: string | number;
  children: ReactNode;
}

export default function LinkToDetail({ itemId, children }: LinkToDetailProps) {
  const href = `/dashboard/items/${itemId}`;

  return (
    <Link 
      href={href} 
      className="block p-4 border border-gray-200 hover:border-blue-500 rounded-lg transition duration-150 cursor-pointer mb-2 bg-white shadow-sm"
    >
      {children}
    </Link>
  );
}