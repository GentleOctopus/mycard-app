// app/login/page.js
'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-gray-900 text-3xl font-bold">Giriş Yap</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="E-posta Adresi"
              className="w-full rounded-md border p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Şifre"
              className="w-full rounded-md border p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
  type="submit"
  className="w-full rounded-md bg-[#f55f1a] p-2 text-white transition hover:opacity-90"
  disabled={loading}
>
            {loading ? 'Yükleniyor...' : 'Giriş Yap'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Hesabın yok mu?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Kayıt Ol
          </a>
        </p>
      </div>
    </div>
  );
}