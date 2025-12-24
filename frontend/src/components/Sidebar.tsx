'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, Store, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authAPI } from '@/lib/api';
import { User } from '@/types';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/franchises', label: 'Franchise Yönetimi', icon: Building2 },
  { href: '/dashboard/branches', label: 'Ofis Yönetimi', icon: Store },
  { href: '/dashboard/profile', label: 'Profil', icon: UserIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  const getUserRole = () => {
    if (!user) return 'Kullanıcı';
    if (user.is_superuser) return 'Yönetici';
    return 'Kullanıcı';
  };

  return (
    <aside className="sidebar">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
        <h1 className="text-lg font-bold leading-tight">RTECA Emlak<br/>Teknolojileri</h1>
      </div>

      <nav className="space-y-2">
        <div className="mb-4">
          <h2 className="text-xs uppercase text-gray-400 mb-3">FRANCHISE YÖNETİM</h2>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-6 left-6 right-6 space-y-3">
        {user && (
          <Link href="/dashboard/profile" className="block px-4 py-3 bg-dark-lighter rounded-lg hover:bg-dark transition-colors">
            <p className="text-xs text-gray-400 mb-1">Oturum Açan</p>
            <p className="text-sm font-medium text-white">{user.full_name}</p>
            <p className="text-xs text-blue-400 mt-1">{getUserRole()}</p>
          </Link>
        )}
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-dark-lighter hover:text-white transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Oturumu Kapat</span>
        </button>
      </div>
    </aside>
  );
}


