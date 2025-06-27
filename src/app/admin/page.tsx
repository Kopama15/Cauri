'use client';

import { useEffect, useState } from 'react';

interface Announcement {
  message: string;
  date?: string;
}

export default function AdminPage() {
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchAnnouncements = async () => {
    const res = await fetch('/api/announcement');
    const data = await res.json();
    setAnnouncements(data.announcements);
  };

  const submitAnnouncement = async () => {
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
          className="p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Nouvelle annonce"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          className="p-2 border border-gray-300 rounded"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-fit"
          onClick={submitAnnouncement}
        >
          Publier
        </button>
      </div>

      <h2 className="font-semibold mb-2">📋 Annonces :</h2>
      <ul className="space-y-2">
        {announcements.map((a, i) => (
          <li key={i} className="flex justify-between items-start bg-gray-100 p-2 rounded">
            <div>
              <p>{a.message}</p>
              {a.date && (
                <p className="text-xs text-gray-500">
                  📅 Active à partir de : {new Date(a.date).toLocaleString()}
                </p>
              )}
            </div>
            <button
              className="text-red-500 text-sm"
              onClick={() => deleteAnnouncement(i)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
