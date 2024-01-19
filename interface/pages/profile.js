import React, { useState, useEffect } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";
import styles from "../app/globals.css";

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        if (supabase.auth) {
          const user = supabase.auth.user;
          console.log("la :", user);
          if (user) {
            const { data, error } = await supabase
              .from("user_profiles")
              .select()
              .eq("user_id", user.id)
              .single();

            if (error) {
              throw error;
            }

            setUserProfile(data);
          } else {
            // L'utilisateur n'est pas connecté, peut-être rediriger vers la page de connexion
            // ou afficher un message invitant l'utilisateur à se connecter.
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Ajouter les dépendances nécessaires ici si besoin

  return (
    <div className={styles.profileContainer}>
      <Head>
        <title>Profil - Remote-PI</title>
      </Head>

      <h1>Profil utilisateur</h1>

      {loading ? (
        <p>Chargement du profil...</p>
      ) : userProfile ? (
        <div>
          <p>Email: {userProfile.email}</p>
          {/* Ajoutez ici le reste du code pour afficher d'autres informations du profil */}
        </div>
      ) : (
        <p>Veuillez vous connecter pour accéder à votre profil.</p>
      )}
    </div>
  );
}
