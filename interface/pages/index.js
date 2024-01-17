import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import HomePage from '../components/HomePage'; // Check this import
import { supabase } from '../lib/supabase';

export default function MainComponent() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        return;
      }

      setLoggedIn(!!sessionData);
    };

    checkSession();

    const authListener = supabase.auth.onAuthStateChange(async () => {
      const { data: updatedSessionData } = await supabase.auth.getSession();
      setLoggedIn(!!updatedSessionData);
    });

    // Check if unsubscribe method exists
    return () => {
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Register - Remote-PI</title>
      </Head>
      <div>
        {loggedIn ? <HomePage /> : <div>Hello, CONNECTE TOI ENFLURE</div>}
      </div>
    </>
  );
}
