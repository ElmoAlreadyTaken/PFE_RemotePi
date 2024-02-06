import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import styles from "../app/globals.css";
import Link from "next/link";


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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );
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
            .select("*")
            .eq("user_id", user.user.id)
            .single();
          if (profileError) throw profileError;
          const userData = { ...profileData, ...user };$
          setUserProfile(userData);
        } else {
          router.push("/"); // Redirect to index if not logged in
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
      <br></br>
      <Head>
        <title>Profile - Remote-PI</title>
      </Head>
      <div className="flex justify-center">
        <div class=" items-center">
          <h1>Profil utilisateur</h1>
        </div>
      </div>
      {loading ? (
        <p>Chargement du profil...</p>
      ) : isLoggedIn ? (
        <div className="flex justify-center">
          <div class=" items-center">
            <br></br>
            <p>Nom: {userProfile.nom}</p>
            <p>Prénom: {userProfile.prénom}</p>
            <p>Email: {userProfile.user.email}</p>
            {userProfile.is_admin && (
                <button
                  className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={() => router.push('/admin')}
                >
                  Accéder à l&apos;Administration
                </button>
              )}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </div>
      ) : (
        <p>Veuillez vous connecter pour accéder à votre profil.</p>
      )}
    </div>
  );
}
