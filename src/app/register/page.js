// src/app/register/page.js
'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.');
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold">Kayıt Ol</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Ad Soyad"
              className="w-full rounded-md border p-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
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
            {loading ? 'Yükleniyor...' : 'Kayıt Ol'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Zaten bir hesabın var mı?{' '}
          <a href="/login" className="text-green-500 hover:underline">
            Giriş Yap
          </a>
        </p>
      </div>
    </div>
  );
}