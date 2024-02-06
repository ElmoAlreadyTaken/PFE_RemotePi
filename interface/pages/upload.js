import React, { useEffect, useState } from "react";
import Head from "next/head";
import HomePage from "../components/HomePage";
import { supabase } from "../lib/supabase";

export default function MainComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAccountValidated, setIsAccountValidated] = useState(false);

  useEffect(() => {
    const checkSessionAndValidation = async () => {
      const { data: user } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      if (user.user != null) {
        const { data: profile, error } = await supabase
          .from("user_profiles")
          .select("validated")
          .eq("user_id", user.user.id)
          .single();

        if (error) {
          console.error("Erreur lors de la récupération du profil:", error);
        } else {
          setIsAccountValidated(profile.validated);
        }
      }
    };

    checkSessionAndValidation();

    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        
      }
    });
  }, []);

  if (!isLoggedIn) {
    return <>You have to log in to see this content.</>;
  }
  
  if (!isAccountValidated) {
    return (
      <div className="min-h-screen header-container2 ">
        <div class="Modern-Slider  ">
          <div class="item ">
            <div class="img-fill">
              <div class="text-content">
                <h3>Bienvenue sur RemotePi</h3>
                <h5>UN PROJET ECE</h5>
                <h5>En attente de validation du compte</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Dashboard - Remote-PI</title>
      </Head>
      <HomePage />
    </>
  );
}
