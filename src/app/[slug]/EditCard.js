// src/app/[slug]/EditCard.js
'use client';

import { useState } from 'react';
import CardComponent from '../../components/CardComponent';
import EditComponents from './EditComponents';

export default function EditCard({ initialComponents, cardId }) {
  const [components, setComponents] = useState(initialComponents);

  return (
    <>
      <div className="lg:w-1/2">
        {/* Sol tarafta düzenleme arayüzü */}
        <EditComponents components={components} setComponents={setComponents} cardId={cardId} />
      </div>
      <div className="lg:w-1/2">
        {/* Sağ tarafta kartın önizlemesi */}
        <CardComponent components={components} />
      </div>
    </>
  );
}
