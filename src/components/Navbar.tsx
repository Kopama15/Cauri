'use client';

import { useEffect, useState } from 'react';
import { FaSearch, FaShoppingCart, FaGlobe } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';

export const Navbar = () => {
  const user = {
    name: 'adefolahan',
    connected: true,
    earnings: 18300,
  };

  const [country, setCountry] = useState('Votre localisation');
  const [announcement, setAnnouncement] = useState<string[]>([]);

  // Fetch user location
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();

        const code = data?.address?.country_code?.toUpperCase();
        if (code) {
          const name = new Intl.DisplayNames(['fr'], { type: 'region' }).of(code);
          setCountry(name ?? 'Votre localisation');
        }
      });
    }
  }, []);

  // Fetch admin announcements and filter by date
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch('/api/announcement');
        const data = await res.json();
        const now = new Date();
        const active = data.announcements?.filter((a: any) => {
          if (!a.date) return true;
          return new Date(a.date) <= now;
        });
        const messages = active.map((a: any) => a.message);
        setAnnouncement(messages);
      } catch (err) {
        console.error('Failed to fetch announcement:', err);
      }
    };

    fetchAnnouncement();
  }, []);

  return (
    <header className="bg-[#131921] text-white text-sm">
      <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-orange-500">Cauri</div>
          <div className="flex flex-col leading-tight text-xs">
            <span className="text-gray-300">Livraison vers</span>
            <span className="font-semibold">{country}</span>
          </div>
        </div>

        <div className="flex flex-1 justify-center w-full max-w-3xl">
          <div className="flex flex-grow max-w-2xl w-full">
            <select className="bg-gray-100 text-black text-xs px-2 py-2 rounded-l-md border-r border-gray-300">
              <option>Toutes les catégories</option>
              <option>Mode</option>
              <option>Électronique</option>
              <option>Beauté & Santé</option>
              <option>Maison & Cuisine</option>
              <option>Supermarché</option>
              <option>Jeux & Jouets</option>
              <option>Sports & Extérieur</option>
              <option>Téléphones</option>
              <option>Accessoires</option>
              <option>Livres</option>
              <option>Informatique</option>
            </select>
            <input
              type="text"
              placeholder="Rechercher sur Cauri"
              className="flex-1 px-4 py-2 text-black bg-white border-none focus:outline-none"
            />
            <button className="bg-yellow-400 px-4 py-2 rounded-r-md">
              <FaSearch className="text-black" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 whitespace-nowrap">
          <div className="hidden lg:flex items-center gap-1 cursor-pointer">
            <FaGlobe />
            <span>FR</span>
            <IoMdArrowDropdown />
          </div>

          <div className="flex flex-col text-xs leading-tight cursor-pointer">
            <span className="text-gray-300">Portefeuille</span>
            <span className="font-semibold text-yellow-400">
              {user.connected ? `${user.earnings.toLocaleString()} FCFA` : '0 FCFA'}
            </span>
          </div>

          <div className="flex flex-col text-xs leading-tight cursor-pointer">
            <span>Bonjour, {user.connected && user.name ? user.name : 'Utilisateur'}</span>
            <span className="font-semibold">
              {user.connected ? 'Mon Compte / Se déconnecter' : 'Se connecter'}
            </span>
          </div>

          <div className="flex flex-col text-xs leading-tight cursor-pointer">
            <span>Retours</span>
            <span className="font-semibold">& Commandes</span>
          </div>

          <div className="relative cursor-pointer">
            <FaShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </div>

      {announcement && announcement.length > 0 && (
        <div className="bg-[#232f3e] overflow-hidden whitespace-nowrap text-white text-sm">
          <div className="animate-marquee flex gap-12 px-4 py-2">
            {announcement.map((msg: string, i: number) => (
              <span key={i} className="inline-block">
                {msg}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
