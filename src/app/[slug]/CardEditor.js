// src/app/[slug]/CardEditor.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';
import CardComponent from '../../components/CardComponent';
import EditCard from './EditCard';

export default function CardEditor({ cardData, initialComponents }) {
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkOwner() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsOwner(session.user.id === cardData.user_id);
      }
    }

    checkOwner();
  }, [cardData.user_id]);

  if (!cardData) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">Kart bulunamadı.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 p-8 max-w-7xl mx-auto">
        {isOwner ? (
          <EditCard initialComponents={initialComponents} cardId={cardData.id} />
        ) : (
          <div className="lg:w-1/2">
            <CardComponent components={initialComponents} />
          </div>
        )}
      </div>
    </Layout>
  );
}
