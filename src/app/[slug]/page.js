// src/app/[slug]/page.js
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { FaLinkedin, FaInstagram, FaFacebook, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaWhatsapp, FaSnapchat, FaTelegram, FaPinterest } from 'react-icons/fa';

// Bileşen türlerine göre ikonları eşleştirme
const getIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'linkedin':
      return <FaLinkedin className="text-blue-600" size={24} />;
    case 'instagram':
      return <FaInstagram className="text-pink-600" size={24} />;
    case 'facebook':
      return <FaFacebook className="text-blue-800" size={24} />;
    case 'x':
      return <FaTwitter className="text-gray-800" size={24} />;
    case 'telefon':
      return <FaPhone className="text-gray-600" size={24} />;
    case 'e-posta':
      return <FaEnvelope className="text-gray-600" size={24} />;
    case 'adres':
      return <FaMapMarkerAlt className="text-gray-600" size={24} />;
    case 'whatsapp':
      return <FaWhatsapp className="text-green-500" size={24} />;
    case 'snapchat':
      return <FaSnapchat className="text-yellow-400" size={24} />;
    case 'telegram':
      return <FaTelegram className="text-blue-400" size={24} />;
    case 'pinterest':
      return <FaPinterest className="text-red-600" size={24} />;
    default:
      return null;
  }
};

// Standart olarak sunulacak bileşenler
const availableComponents = [
  'linkedin',
  'instagram',
  'facebook',
  'x',
  'whatsapp',
  'snapchat',
  'telegram',
  'pinterest',
  'telefon',
  'e-posta',
  'adres'
];


export default function CardPage() {
  const pathname = usePathname();
  const slug = pathname.split('/').pop();

  const [card, setCard] = useState(null);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComponentType, setNewComponentType] = useState('');
  const [newComponentValue, setNewComponentValue] = useState('');
  const [editingComponentId, setEditingComponentId] = useState(null);
  const [editedComponentValue, setEditedComponentValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;

    const fetchCardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir.
        router.push('/login');
        return;
      }

      const { data: cardData, error: cardError } = await supabase
        .from('cards')
        .select('*')
        .eq('slug', slug)
        .eq('user_id', user.id)
        .single();
      
      if (cardError) {
        console.error("Kart çekilirken hata:", cardError);
        setLoading(false);
        return;
      }
      
      setCard(cardData);

      const { data: componentsData, error: componentsError } = await supabase
        .from('components')
        .select('*')
        .eq('card_id', cardData.id);

      if (!componentsError) {
        setComponents(componentsData);
      }
      
      setLoading(false);
    };

    fetchCardData();
  }, [slug, router]);

  const handleAddComponent = async (type, value) => {
    if (!type || !value) return;

    const { data: newComponent, error } = await supabase
      .from('components')
      .insert({
        card_id: card.id,
        type: type,
        value: value,
      })
      .select()
      .single();
    
    if (error) {
      console.error(error.message);
    } else {
      setComponents([...components, newComponent]);
    }
  };

  const handleEditComponent = (component) => {
    setEditingComponentId(component.id);
    setEditedComponentValue(component.value);
  };

  const handleCancelEdit = () => {
    setEditingComponentId(null);
    setEditedComponentValue('');
  };

  const handleSaveComponent = async (e, componentId) => {
    e.preventDefault();
    if (!editedComponentValue) return;
    
    const { data: updatedComponent, error } = await supabase
      .from('components')
      .update({
        value: editedComponentValue,
      })
      .eq('id', componentId)
      .select()
      .single();

    if (error) {
      console.error(error.message);
    } else {
      setComponents(components.map(c => 
        c.id === componentId ? updatedComponent : c
      ));
      setEditingComponentId(null);
      setEditedComponentValue('');
    }
  };

  const handleDeleteComponent = async (componentId) => {
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', componentId);
    
    if (error) {
      console.error(error.message);
    } else {
      setComponents(components.filter(c => c.id !== componentId));
    }
  };
  
  // Yeni eklenen fonksiyon
  const handleSelectNewComponent = (type) => {
    const value = prompt(`Lütfen ${type} hesabının adresini veya değerini girin:`);
    if (value) {
      handleAddComponent(type, value);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Yükleniyor...</div>;
  }

  if (!card) {
    return <div className="flex min-h-screen items-center justify-center">Kart bulunamadı.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">{card.title}</h1>
        <p className="mb-8 text-xl text-gray-600">/{card.slug}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sol Sütun: Bileşenler */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Bileşenler</h2>
            {components.length > 0 ? (
              <div className="space-y-4">
                {components.map(component => (
                  <div key={component.id} className="rounded-md border p-4 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center space-x-4">
                      {getIcon(component.type)}
                      {editingComponentId === component.id ? (
                        <form onSubmit={(e) => handleSaveComponent(e, component.id)} className="flex items-center space-x-2 w-full">
                          <p className="font-bold text-gray-800 w-1/3">{component.type}</p>
                          <input
                            type="text"
                            value={editedComponentValue}
                            onChange={(e) => setEditedComponentValue(e.target.value)}
                            className="rounded-md border p-1 text-gray-800 w-2/3"
                          />
                          <button
                            type="submit"
                            className="text-green-500 hover:text-green-700"
                          >
                            <FaSave size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes size={20} />
                          </button>
                        </form>
                      ) : (
                        <div>
                          <p className="font-bold text-gray-800">{component.type}</p>
                          <p className="text-gray-600">{component.value}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditComponent(component)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteComponent(component.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md transition hover:bg-red-600"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Bu kartta henüz bileşen yok.</p>
            )}
            
          </div>
          
          {/* Sağ Sütun: Yeni Bileşen Ekleme Formu */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Yeni Bileşen Ekle</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddComponent(newComponentType, newComponentValue);
              setNewComponentType('');
              setNewComponentValue('');
            }} className="space-y-4">
              <input
                type="text"
                placeholder="Bileşen Türü (örn: instagram)"
                value={newComponentType}
                onChange={(e) => setNewComponentType(e.target.value)}
                className="w-full rounded-md border p-2 text-gray-800"
              />
              <input
                type="text"
                placeholder="Bileşen Değeri"
                value={newComponentValue}
                onChange={(e) => setNewComponentValue(e.target.value)}
                className="w-full rounded-md border p-2 text-gray-800"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-[#f55f1a] p-2 text-white transition hover:opacity-90"
              >
                Bileşen Ekle
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
