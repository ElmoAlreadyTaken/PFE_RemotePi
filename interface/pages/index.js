import React, { useEffect, useState } from "react";
import Head from "next/head";
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


  return (
    <>
      <Head>
        <title>Remote-PI</title>
      </Head>
      <div className="header-container2 min-h-screen ">
        <div class="Modern-Slider  ">
          <div class="item ">
            <div class="img-fill">
              <div class="text-content">
                <h3>Bienvenue sur RemotePi</h3>
                <h5>UN PROJET ECE</h5>
                <a href="/about" class="main-stroked-button">
                  En Savoir plus
                </a>
                {isLoggedIn ? (
                  <>
                    <a href="/upload" class="main-filled-button">
                      Téléverser maintenant
                    </a>
                  </>
                ) : (
                  <a href="/login" class="main-filled-button">
                    Téléverser maintenant
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
