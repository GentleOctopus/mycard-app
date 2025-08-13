// src/app/[slug]/EditComponents.js
'use client';

// Bu bileşen, kart bileşenlerini düzenlemek için kullanılacaktır.
// Şimdilik sadece bir yer tutucu olarak hizmet ediyor.

export default function EditComponents({ components, setComponents, cardId }) {
  // components ve setComponents state'ini kullanarak düzenleme mantığı buraya eklenecektir.

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Kart Bileşenlerini Düzenle</h2>
      <p className="text-gray-600">
        Bileşenleri buradan düzenleyebilirsiniz. Bu kısım daha sonra interaktif araçlar içerecektir.
      </p>
    </div>
  );
}
