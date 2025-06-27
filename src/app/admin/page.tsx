'use client';

import { useEffect, useState } from 'react';

type Announcement = {
  message: string;
  date?: string;
};

export default function AdminPage() {
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcement');
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error('Erreur lors du chargement des annonces', err);
    }
  };

  const submitAnnouncement = async () => {
    if (!message.trim()) return;

    await fetch('/api/announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, date }),
    });

    setMessage('');
    setDate('');
    fetchAnnouncements();
  };

  const deleteAnnouncement = async (index: number) => {
    await fetch('/api/announcement', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index }),
    });

    fetchAnnouncements();
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🛠️ Admin - Annonces</h1>

      <div className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded"
          placeholder="📢 Tapez votre annonce (avec emoji)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="datetime-local"
          className="p-2 border border-gray-300 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-fit"
          onClick={submitAnnouncement}
        >
          Publier
        </button>
      </div>

      <h2 className="font-semibold mb-2">📋 Annonces programmées :</h2>
      <ul className="space-y-2">
        {announcements.length === 0 && (
          <li className="text-gray-500 text-sm">Aucune annonce pour le moment.</li>
        )}
        {announcements.map((a, i) => (
          <li
            key={i}
            className="flex justify-between items-start bg-gray-100 p-3 rounded"
          >
            <div className="text-sm">
              <p>{a.message}</p>
              {a.date && (
                <p className="text-xs text-gray-500 mt-1">
                  📅 Active à partir de :{' '}
                  {new Date(a.date).toLocaleString('fr-FR')}
                </p>
              )}
            </div>
            <button
              onClick={() => deleteAnnouncement(i)}
              className="text-red-500 text-sm ml-4"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
