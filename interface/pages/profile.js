import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { supabase } from "../lib/supabase";
import styles from "../app/globals.css";
import { data } from "autoprefixer";

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
  
        // Fetch the current user
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
  
        if (user) {
          // Fetch user profile data
          const { data: profileData, error: profileError } = await supabase
            .from("user_profiles")
            .select()
            .eq("user_id", user.user.id)
            .single();
          console.log("request : ",profileData);
          console.log("user : ",user);
          if (profileError) throw profileError;
          const userData ={...profileData,...user};
          console.log("userData : ",userData);
          setUserProfile(userData);
        } else {
          router.push('/'); // Redirect to index if not logged in
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []); // Dependencies array is empty as we want this to run only once on component mount

  return (
    <div className={styles.profileContainer}>
      <Head>
        <title>Profile - Remote-PI</title>
      </Head>

      <h1>Profil utilisateur</h1>

      {loading ? (
        <p>Chargement du profil...</p>
      ) : isLoggedIn ? (
        <div>
          <p>Nom: {userProfile.nom}</p>
          <p>Prénom: {userProfile.prénom}</p>
          <p>Email: {userProfile.user.email}</p>
        </div>
      ) : (
        <p>Veuillez vous connecter pour accéder à votre profil.</p>
      )}
    </div>
  );
}
