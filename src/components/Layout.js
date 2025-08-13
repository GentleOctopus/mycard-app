// src/components/Layout.js
'use client';

import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Head>
        <title>MyCard App</title>
        <meta name="description" content="Kişiselleştirilmiş kartlar oluşturun ve düzenleyin" />
      </Head>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
