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
        <title>À Propos - Remote-PI</title>
      </Head>

      <section class="section " id="about">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 col-md-6 col-xs-12">
              <div class="left-text-content">
                <div class="section-heading">
                  <h6>À Propos de nous</h6>
                  <h2>RemotePi : Codez à distance et sans limite.</h2>
                </div>
                <div class="row">
                  <div class="col-md-6 col-sm-6">
                    <div class="service-item">
                      <img src="/service-item-01.png" alt="" />
                      <h4>Automatisé</h4>
                    </div>
                  </div>
                  <div class="col-md-6 col-sm-6">
                    <div class="service-item">
                      <img src="/service-item-01.png" alt="" />
                      <h4>Intuitif</h4>
                    </div>
                  </div>
                  <div class="col-md-6 col-sm-6">
                    <div class="service-item">
                      <img src="/contact-info-03.png" alt="" />
                      <h4>Polyvalent</h4>
                    </div>
                  </div>
                  <div class="col-md-6 col-sm-6">
                    <div class="service-item">
                      <img src="/contact-info-03.png" alt="" />
                      <h4>Sécurisé</h4>
                    </div>
                  </div>

                  {isLoggedIn ? (
                    <>
                      <div class="col-md-12">
                        <a href="/upload" class="main-button-icon">
                          SE LANCER <i class="fa fa-arrow-right"></i>
                        </a>
                      </div>
                    </>
                  ) : (
                    <div class="col-md-12">
                      <a href="/login" class="main-button-icon">
                        SE LANCER <i class="fa fa-arrow-right"></i>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-md-6 col-xs-12">
              <div class="right-text-content">
                <h3 className="text-black">Qui sommes-nous ?</h3>
                Nous sommes un groupe d'étudiants en 5ème année du cursus
                ingénieur à l’ECE Paris, passionnés par l'électronique et
                l'informatique. Notre équipe a choisi de fusionner ces
                compétences pour concrétiser RemotePi, une solution innovante
                qui marque la conclusion de notre formation.
                <br></br>Redistributing this template as a downloadable ZIP file
                on any template collection website is strictly prohibited. You
                will need to talk to us if you want to redistribute this
                template. Thank you.
                <br></br>
                <br></br>
                <h3 className="text-black">RemotePi, c'est quoi ?</h3>
                RemotePi va au-delà d'un simple projet ; il incarne une
                initiative audacieuse pour rendre la programmation électronique
                accessible à chacun. Cette plateforme permet le contrôle à
                distance de votre robot, facilitant le téléversement de code via
                Internet. En repoussant les limites de la robotique éducative,
                RemotePi offre aux équipes la possibilité de collaborer sur un
                robot partagé, favorisant ainsi l'apprentissage à distance de
                manière interactive.
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </section>
    </>
  );
}
