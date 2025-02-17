'use client';
import Link from 'next/link';


export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-center items-center">
        <Link href="/">
          <h1 className="text-3xl font-bold">SHOPPP SMARTTT</h1>
        </Link>
      </div>
    </header>
  );
}