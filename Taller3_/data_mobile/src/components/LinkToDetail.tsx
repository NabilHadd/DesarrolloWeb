import Link from 'next/link';
import { ReactNode } from 'react';

export default function LinkToDetail(props: { itemId: number, children: ReactNode}) {
  console.log(props.itemId)
  const href = `/dashboard/items/${props.itemId}`;

  return (
    <Link 
      href={href} 
      className="block p-4 border border-gray-200 hover:border-blue-500 rounded-lg transition duration-150 cursor-pointer mb-2 bg-white shadow-sm"
    >
      {props.children}
    </Link>
  );
}