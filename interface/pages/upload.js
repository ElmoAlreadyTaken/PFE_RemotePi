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
      console.log("data: ", user);

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
        // Répétez la vérification de validation ici si nécessaire
      }
    });
  }, []);

  if (!isLoggedIn) {
    return <>You have to log in to see this content.</>;
  }
  
  if (!isAccountValidated) {
    return (
      <div>
        Votre compte est en attente de validation par un administrateur.
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Remote-PI Dashboard</title>
      </Head>
      <HomePage />
    </>
  );
}
