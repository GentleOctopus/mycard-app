// src/app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!profileError) {
        setProfile(profileData);
      }
      
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (!cardsError) {
        setCards(cardsData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleCreateNewCard = async () => {
    const newCardTitle = prompt("Lütfen yeni kartınız için bir başlık girin:");
    if (!newCardTitle) return;

    const { data: newCard, error: cardError } = await supabase
        .from('cards')
        .insert([{ user_id: user.id, title: newCardTitle, slug: newCardTitle.toLowerCase().replace(/\s/g, '-') }])
        .select()
        .single();

    if (cardError) {
        alert(cardError.message);
        return;
    }

    const defaultComponents = [
        { card_id: newCard.id, type: 'Ad Soyad', value: profile.full_name || '' },
        { card_id: newCard.id, type: 'Telefon', value: '' },
        { card_id: newCard.id, type: 'E-posta', value: user.email || '' },
        { card_id: newCard.id, type: 'Adres', value: '' },
        { card_id: newCard.id, type: 'LinkedIn', value: '' },
        { card_id: newCard.id, type: 'X', value: '' },
        { card_id: newCard.id, type: 'Instagram', value: '' },
        { card_id: newCard.id, type: 'Facebook', value: '' },
    ];

    const { error: componentsError } = await supabase
        .from('components')
        .insert(defaultComponents);

    if (componentsError) {
        alert(componentsError.message);
    } else {
        window.location.reload(); 
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-800">Hoş Geldin, {profile?.full_name || user?.email}!</h1>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">Kartlarım</h2>
          <div className="space-y-4">
            {cards.length > 0 ? (
              cards.map((card) => (
                <div key={card.id} className="rounded-md border p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-medium">{card.title}</h3>
                    <p className="text-sm text-gray-500">/{card.slug}</p>
                  </div>
                  <Link href={`/${card.slug}`}>
                    <button className="bg-[#f55f1a] text-white px-4 py-2 rounded-md transition hover:opacity-90">
                      Kartı Düzenle
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Henüz bir kartın yok. Hemen bir tane oluştur!</p>
            )}
          </div>
          <button 
            onClick={handleCreateNewCard}
            className="mt-6 w-full rounded-md bg-[#f55f1a] p-2 text-white transition hover:opacity-90"
          >
            + Yeni Kart Oluştur
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 rounded-md bg-red-500 px-6 py-2 text-white shadow-md transition hover:bg-red-600"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}