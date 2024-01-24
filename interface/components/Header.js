import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '../lib/supabase';

export default function Header({ theme, setTheme }){
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const router = useRouter();

  const handleSubMenuToggle = () => {
    setSubMenuOpen(!isSubMenuOpen);
  }

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  return (
    <header className="bg-white">
    <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div className="flex lg:flex-1">
        <Link href="/">
          {/* Augmentez ces valeurs pour agrandir le logo */}
          <Image src="/logo.png" alt="Logo" width={80} height={90} className="cursor-pointer" />
        </Link>
      </div>
    <div className="flex lg:hidden">
      <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
        <span className="sr-only">Open main menu</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>
    
    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        {isLoggedIn ? (
          <>
            <Link href="/profile" class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Profile
            </Link>
            <button onClick={handleLogout} class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Déconnexion
            </button>
          </>
        ) : (
          <div>
          <Link href="/login" class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Se connnecter
          </Link>
          <Link href="/register" class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">S'inscrire
          </Link>
          </div>
        )}
      </div>
  </nav>
  
</header>
  );
}