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
    return (
      <>
        <div
          class="flex items-center justify-center"
          style={{ height: "calc(100vh - 100px)" }}
        >
          Vous devez être connecté pour accéder à cette page.
        </div>
      </>
    );
  }

  if (!isAccountValidated) {
    return (
      <>
        <div
          class="flex items-center justify-center"
          style={{ height: "calc(100vh - 100px)" }}
        >
          Un admnistrateur doit valider votre compte.
        </div>
      </>
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
