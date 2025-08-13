// src/components/Header.js
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="text-2xl font-bold text-gray-800 hover:text-gray-600">MyCard App</div>
        </Link>
        <nav className="space-x-4">
          <Link href="/create">
            <div className="text-gray-600 hover:text-gray-800">Kart Oluştur</div>
          </Link>
          <Link href="/deneme">
            <div className="text-gray-600 hover:text-gray-800">Kartlarım</div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
