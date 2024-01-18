// pages/profile.js
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase"; // Assurez-vous que le chemin est correct
import styles from "../app/globals.css"; // Utilisez vos styles globaux ou CSS module

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [name, setName] = useState("");
  const [prénom, setPrénom] = useState("");
  const [promotion, setPromotion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Vérifier si supabase.auth est défini et si user() est une fonction
        if (supabase.auth && typeof supabase.auth.user === "function") {
          const { data, error } = await supabase
            .from("user_profiles")
            .select()
            .eq("user_id", supabase.auth.user().id)
            .single();

          if (error) {
            throw error;
          }

          setUserProfile(data);
          setName(data.nom);
          setPrénom(data.prénom);
          setPromotion(data.promotion);
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    if (supabase.auth && typeof supabase.auth.user === "function") {
      fetchProfile();
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({ nom: name, prénom, promotion })
        .eq("user_id", supabase.auth.user().id)
        .single();

      if (error) {
        throw error;
      }

      setUserProfile(data);
      console.log("Profile updated:", data);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setError("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <Head>
        <title>Profil - Remote-PI</title>
      </Head>

      <h1>Profil utilisateur</h1>

      {userProfile && (
        <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Nom:{" "}
            </label>
            <input
              type="text"
              placeholder="Nom"
              className={styles.inputField}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="prénom" className={styles.label}>
              Prénom:{" "}
            </label>
            <input
              type="text"
              placeholder="Prénom"
              className={styles.inputField}
              value={prénom}
              onChange={(e) => setPrénom(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="promotion" className={styles.label}>
              Promotion:{" "}
            </label>
            <input
              type="text"
              placeholder="Promotion"
              className={styles.inputField}
              value={promotion}
              onChange={(e) => setPromotion(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={styles.updateButton}
            disabled={loading}
          >
            {loading ? "Mise à jour..." : "MISE À JOUR"}
          </button>
        </form>
      )}
    </div>
  );
}
