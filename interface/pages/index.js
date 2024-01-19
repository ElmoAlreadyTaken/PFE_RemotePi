import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import HomePage from '../components/HomePage';
import { supabase } from '../lib/supabase';

export default function MainComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    // Set up a listener for authentication state changes
    const subscription  = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

   
  }, []);

  return (
    <>
      <Head>
        <title>Remote-PI Dashboard</title>
      </Head>
      <div>
        {isLoggedIn ? <HomePage /> : <div>Hello, CONNECTE TOI ENFLURE</div>}
      </div>
    </>
  );
}
